import "reflect-metadata";
import {
  Get,
  Post,
  Delete,
  Put,
  Body,
  QueryParam,
  Param,
  JsonController,
  Authorized,
  Req,
  Res,
} from "routing-controllers";
import { classToPlain } from "class-transformer";
import {env} from '../../../env';
import { CustomerService } from "../../services/CustomerService";
import { Customer } from "../../models/Customer";
import { CreateCustomer } from "./requests/CreateCustomerRequest";
import { User } from "../../models/User";
// import {MAILService} from '../../auth/mail.services';
import { UpdateCustomer } from "./requests/UpdateCustomerRequest";
// import {EmailTemplateService} from '../services/EmailTemplateService';
import { DeleteCustomerRequest } from "./requests/DeleteCustomerRequest";
import * as fs from "fs";
import { S3Service } from "../../services/S3Service";
import { ImageService } from "../../services/ImageService";
import { CreateCustomerToken } from "./requests/CreateCustomerTokenRequest";
import { GTPaymentGatewayService } from "../../services/GTPaymentGatewayService";
// import { CustomerPaymentToken } from "../../models/CustomerPaymentToken";
// import { CustomerPaymentTokenService } from "../../services/CustomerPaymentToken";

@JsonController("/user-customer")
export class CustomerController {
  constructor(private customerService: CustomerService,
              private s3Service: S3Service,
              private imageService: ImageService,
              private gtPaymentGatewayService: GTPaymentGatewayService
              // private customerPaymentTokenService: CustomerPaymentTokenService
               ) {}

  // Create Customer API
  /**
   * @api {post} /api/user-customer/add-customer Add Customer API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} customerGroupId Customer customerGroupId
   * @apiParam (Request body) {String} firstName Customer firstName
   * @apiParam (Request body) {String} lastName Customer lastName
   * @apiParam (Request body) {String} username Customer username
   * @apiParam (Request body) {String} email Customer email
   * @apiParam (Request body) {Number} mobileNumber Customer mobileNumber
   * @apiParam (Request body) {String} password Customer password
   * @apiParam (Request body) {String} confirmPassword Customer confirmPassword
   * @apiParam (Request body) {String} avatar Customer avatar
   * @apiParam (Request body) {Number} mailStatus Customer mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status Customer status
   * @apiParamExample {json} Input
   * {
   *      "customerGroupId" : "",
   *      "firstName" : "",
   *      "lastName" : "",
   *      "username" : "",
   *      "email" : "",
   *      "mobileNumber" : "",
   *      "password" : "",
   *      "confirmPassword" : "",
   *      "avatar" : "",
   *      "mailStatus" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Customer Created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/add-customer
   * @apiErrorExample {json} Customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/add-customer")
  @Authorized()
  public async addCustomer(
    @Body({ validate: true }) customerParam: CreateCustomer,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const avatar = customerParam.avatar;
    const newCustomer: any = new Customer();
    const resultUser = await this.customerService.findOne({
      where: { email: customerParam.email, deleteFlag: 0 },
    });
    if (resultUser) {
      const successResponse: any = {
        status: 1,
        message: "Already registered with this emailId.",
      };
      return response.status(400).send(successResponse);
    }
    if (avatar) {
      const type = avatar.split(';')[0].split('/')[1];
      const name = 'Img_' + Date.now() + '.' + type;
      const path = 'customers/';
      const base64Data = Buffer.from(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      if (env.imageserver === 's3') {
          await this.s3Service.imageUpload((path + name), base64Data, type);
      } else {
          await this.imageService.imageUpload((path + name), base64Data);
      }
      newCustomer.avatar = name;
      newCustomer.avatarPath = path;
    }
    if (customerParam.password === customerParam.confirmPassword) {
      const password = await User.hashPassword(customerParam.password);
      newCustomer.customerGroupId = customerParam.customerGroupId;
      newCustomer.firstName = customerParam.firstName;
      newCustomer.lastName = customerParam.lastName;
      newCustomer.username = customerParam.username;
      newCustomer.email = customerParam.email;
      newCustomer.mobileNumber = customerParam.mobileNumber;
      newCustomer.password = password;
      newCustomer.mailStatus = customerParam.mailStatus;
      newCustomer.deleteFlag = 0;
      newCustomer.isActive = customerParam.status;

      const customerSave = await this.customerService.create(newCustomer);

      if (customerSave) {
        if (customerParam.mailStatus === 1) {
          // const emailContent = await this.emailTemplateService.findOne(4);
          // const message = emailContent.content.replace('{name}', customerParam.username).replace('{username}', customerParam.email).replace('{password}', customerParam.password);
          // MAILService.customerLoginMail(message, customerParam.email, emailContent.subject, redirectUrl);
          const successResponse: any = {
            status: 1,
            message:
              "Successfully created new Customer with user name and password and send an email. ",
            data: customerSave,
          };
          return response.status(200).send(successResponse);
        } else {
          const successResponse: any = {
            status: 1,
            message: "Customer Created Successfully",
            data: customerSave,
          };
          return response.status(200).send(successResponse);
        }
      }
    } else {
      const errorResponse: any = {
        status: 0,
        message: "Password does not match.",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Customer List API
  /**
   * @api {get} /api/user-customer/customerlist Customer List API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} name search by name
   * @apiParam (Request body) {String} email search by email
   * @apiParam (Request body) {Number} status 0->inactive 1-> active
   * @apiParam (Request body) {String} customerGroup search by customerGroup
   * @apiParam (Request body) {String} date search by date
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get customer list",
   *      "data":{
   *      "customerGroupId" : "",
   *      "username" : "",
   *      "email" : "",
   *      "mobileNUmber" : "",
   *      "password" : "",
   *      "avatar" : "",
   *      "avatarPath" : "",
   *      "status" : "",
   *      "safe" : "",
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/customerlist
   * @apiErrorExample {json} customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/customerlist")
  @Authorized()
  public async customerList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("name") name: string,
    @QueryParam("status") status: string,
    @QueryParam("email") email: string,
    @QueryParam("customerGroup") customerGroup: string,
    @QueryParam("date") date: string,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const search = [
      {
        name: "firstName",
        op: "like",
        value: name,
      },
      {
        name: "email",
        op: "like",
        value: email,
      },
      {
        name: "createdDate",
        op: "like",
        value: date,
      },
      {
        name: "customerGroupId",
        op: "like",
        value: customerGroup,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];
    const WhereConditions = [
      {
        name: "deleteFlag",
        value: 0,
      },
    ];
    const customerList = await this.customerService.list(
      limit,
      offset,
      search,
      WhereConditions,
      0,
      count
    );
    if (count) {
      const successRes: any = {
        status: 1,
        message: "Successfully got count ",
        data: customerList,
      };
      return response.status(200).send(successRes);
    }
    const data: any = customerList.map(async (value: any) => {
      const temp: any = value;
      temp.customerGroupName = "";
      return temp;
    });
    const Customers = await Promise.all(data);
    const successResponse: any = {
      status: 1,
      message: "Successfully got Customer list.",
      data: Customers,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Customer API
  /**
   * @api {delete} /api/user-customer/delete-customer/:id Delete Customer API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "customerId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted customer.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/delete-customer/:id
   * @apiErrorExample {json} Customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-customer/:id")
  @Authorized()
  public async deleteCustomer(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const customer = await this.customerService.findOne({
      where: {
        id,
      },
    });
    if (!customer) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid customerId",
      };
      return response.status(400).send(errorResponse);
    }
    customer.deleteFlag = 1;
    const deleteCustomer = await this.customerService.create(customer);
    if (deleteCustomer) {
      const successResponse: any = {
        status: 1,
        message: "Customer Deleted Successfully",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to change delete flag status",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Customer API
  /**
   * @api {put} /api/user-customer/update-customer/:id Update Customer API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} customerGroupId Customer customerGroupId
   * @apiParam (Request body) {String} firstName Customer firstName
   * @apiParam (Request body) {String} lastName Customer lastName
   * @apiParam (Request body) {String} username Customer username
   * @apiParam (Request body) {String} email Customer email
   * @apiParam (Request body) {Number} mobileNumber Customer mobileNumber
   * @apiParam (Request body) {String} password Customer password
   * @apiParam (Request body) {String} confirmPassword Customer confirmPassword
   * @apiParam (Request body) {String} avatar Customer avatar
   * @apiParam (Request body) {Number} mailStatus Customer mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status Customer status
   * @apiParamExample {json} Input
   * {
   *      "customerGroupId" : "",
   *      "firstName" : "",
   *      "lastName" : "",
   *      "username" : "",
   *      "email" : "",
   *      "mobileNumber" : "",
   *      "password" : "",
   *      "confirmPassword" : "",
   *      "avatar" : "",
   *      "mailStatus" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": " Customer is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/update-customer/:id
   * @apiErrorExample {json} updateCustomer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-customer/:id")
  @Authorized()
  public async updateCustomer(
    @Param("id") id: number,
    @Body({ validate: true }) customerParam: UpdateCustomer,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    console.log(customerParam);
    const customer = await this.customerService.findOne({
      where: {
        id,
      },
    });
    if (!customer) {
      const errorResponse: any = {
        status: 0,
        message: "invalid customer id",
      };
      return response.status(400).send(errorResponse);
    }
    if (customerParam.password === customerParam.confirmPassword) {
      const avatar = customerParam.avatar;
      if (avatar) {
        const type = avatar.split(';')[0].split('/')[1];
        const name = 'Img_' + Date.now() + '.' + type;
        const path = 'customers/';
        const base64Data = Buffer.from(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        if (env.imageserver === 's3') {
            await this.s3Service.imageUpload((path + name), base64Data, type);
        } else {
            await this.imageService.imageUpload((path + name), base64Data);
        }
        customer.avatar = name;
        customer.avatarPath = path;
      }
      // const password = await User.hashPassword(customerParam.password);
      customer.customerGroupId = customerParam.customerGroupId;
      customer.firstName = customerParam.firstName;
      customer.lastName = customerParam.lastName;
      customer.username = customerParam.username;
      customer.email = customerParam.email;
      customer.mobileNumber = customerParam.mobileNumber;
      if (customerParam.password) {
        const password = await User.hashPassword(customerParam.password);
        customer.password = password;
      }
      customer.mailStatus = customerParam.mailStatus;
      customer.isActive = customerParam.status;
      const customerSave = await this.customerService.create(customer);
      if (customerSave) {
        const successResponse: any = {
          status: 1,
          message: "Customer Updated Successfully",
          data: customerSave,
        };
        return response.status(200).send(successResponse);
      }
    } else {
      const errorResponse: any = {
        status: 0,
        message: "Password does not match.",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Get Customer Detail API
  /**
   * @api {get} /api/user-customer/customer-details/:id Customer Details API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully get customer Details",
   * "data":{
   * "customerGroupId" : "",
   * "username" : "",
   * "email" : "",
   * "mobileNumber" : "",
   * "password" : "",
   * "avatar" : "",
   * "avatarPath" : "",
   * "newsletter" : "",
   * "status" : "",
   * "safe" : "",
   * }
   * "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/customer-details/:id
   * @apiErrorExample {json} customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/customer-details/:id")
  @Authorized()
  public async customerDetails(
    @Param("id") Id: number,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const customer = await this.customerService.findOne({
      select: [
        "id",
        "firstName",
        "email",
        "mobileNumber",
        "address",
        "lastLogin",
        "isActive",
        "mailStatus",
        "customerGroupId",
      ],
      where: { id: Id },
    });
    if (!customer) {
      const errorResponse: any = {
        status: 0,
        message: "invalid CustomerId",
      };
      return response.status(400).send(errorResponse);
    }

    const successResponse: any = {
      status: 1,
      message: "successfully got Customer details. ",
      data: customer,
    };
    return response.status(200).send(successResponse);
  }

  // Recently Added Customer List API
  /**
   * @api {get} /api/user-customer/recent-customerlist Recent Customer List API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "status": "1"
   *      "message": "Successfully get customer list",
   *      "data":{
   *      "location" : "",
   *      "name" : "",
   *      "created date" : "",
   *      "isActive" : "",
   *      }
   * }
   * @apiSampleRequest /api/user-customer/recent-customerlist
   * @apiErrorExample {json} customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/recent-customerlist")
  @Authorized()
  public async recentCustomerList(@Req() request: any, @Res() response: any): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const order = 1;
    const WhereConditions = [
      {
        name: "deleteFlag",
        value: 0,
      },
    ];
    const customerList = await this.customerService.list(
      0,
      0,
      0,
      WhereConditions,
      order,
      0
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully got Customer list.",
      data: classToPlain(customerList),
    };

    return response.status(200).send(successResponse);
  }

  //  Today Customer Count API
  /**
   * @api {get} /api/user-customer/today-customercount Today Customer Count API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get Today customer count",
   *      "data":{
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/today-customercount
   * @apiErrorExample {json} order error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/today-customercount")
  @Authorized()
  public async customerCount(@Req() request: any, @Res() response: any): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const nowDate = new Date();
    const todaydate =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();
    const customerCount = await this.customerService.todayCustomerCount(
      todaydate
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully get customerCount",
      data: customerCount,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Multiple Customer API
  /**
   * @api {post} /api/user-customer/delete-customer Delete Multiple Customer API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {array} customerId customerId
   * @apiParamExample {json} Input
   * {
   * "customerId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully deleted customer.",
   * "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/delete-customer
   * @apiErrorExample {json} customerDelete error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/delete-customer")
  @Authorized()
  public async deleteMultipleCustomer(
    @Body({ validate: true }) deleteCustomerId: DeleteCustomerRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const customers = deleteCustomerId.customerId.toString();
    const customer: any = customers.split(",");
    console.log(customer);
    const data: any = customer.map(async (id: any) => {
      const dataId = await this.customerService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Please choose customer for delete",
        };
        return response.status(400).send(errorResponse);
      } else {
        dataId.deleteFlag = 1;
        return await this.customerService.create(dataId);
      }
    });
    const deleteCustomer = await Promise.all(data);
    if (deleteCustomer) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted customer",
      };
      return response.status(200).send(successResponse);
    }
  }

  // Customer Details Excel Document Download
  /**
   * @api {get} /api/user-customer/customer-excel-list Customer Excel
   * @apiGroup User Customer
   * @apiParam (Request body) {String} customerId customerId
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the Customer Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/user-customer/customer-excel-list
   * @apiErrorExample {json} Customer Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/customer-excel-list")
  @Authorized()
  public async excelCustomerView(
    @QueryParam("customerId") customerId: string,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Customer Export sheet");
    const rows = [];
    const customerid = customerId.split(",");
    for (const id of customerid) {
      const dataId = await this.customerService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Invalid customerId",
        };
        return response.status(400).send(errorResponse);
      }
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Customer Id", key: "id", size: 16, width: 15 },
      { header: "Customer Name", key: "first_name", size: 16, width: 15 },
      { header: "User Name", key: "username", size: 16, width: 24 },
      { header: "Email Id", key: "email", size: 16, width: 15 },
      { header: "Mobile Number", key: "mobileNumber", size: 16, width: 15 },
      {
        header: "Date Of Registration",
        key: "createdDate",
        size: 16,
        width: 15,
      },
    ];
    worksheet.getCell("A1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("B1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("C1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("D1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("E1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("F1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    for (const id of customerid) {
      const dataId = await this.customerService.findOne(id);
      if (dataId.lastName === null) {
        dataId.lastName = "";
      }
      rows.push([
        dataId.id,
        dataId.firstName + " " + dataId.lastName,
        dataId.username,
        dataId.email,
        dataId.mobileNumber,
        dataId.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./CustomerExcel_" + Date.now() + ".xlsx";
    await workbook.xlsx.writeFile(fileName);
    return new Promise((resolve, reject) => {
      response.download(fileName, (err, data) => {
        if (err) {
          reject(err);
        } else {
          fs.unlinkSync(fileName);
          return response.end();
        }
      });
    });
  }

  // Customer Details Excel Document Download
  /**
   * @api {get} /api/user-customer/allcustomer-excel-list All Customer Excel
   * @apiGroup User Customer
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the All Customer Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/user-customer/allcustomer-excel-list
   * @apiErrorExample {json} All Customer Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/allcustomer-excel-list")
  @Authorized()
  public async AllCustomerExcel(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Bulk Customer Export");
    const rows = [];
    const dataId = await this.customerService.findAll();
    if (dataId === undefined) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid customerId",
      };
      return response.status(400).send(errorResponse);
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Customer Id", key: "id", size: 16, width: 15 },
      { header: "Customer Name", key: "first_name", size: 16, width: 15 },
      { header: "User Name", key: "username", size: 16, width: 24 },
      { header: "Email Id", key: "email", size: 16, width: 15 },
      { header: "Mobile Number", key: "mobileNumber", size: 16, width: 15 },
      {
        header: "Date Of Registration",
        key: "createdDate",
        size: 16,
        width: 15,
      },
    ];
    worksheet.getCell("A1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("B1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("C1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("D1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("E1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("F1").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    const customers = await this.customerService.findAll();
    for (const customer of customers) {
      if (customer.lastName === null) {
        customer.lastName = "";
      }
      rows.push([
        customer.id,
        customer.firstName + " " + customer.lastName,
        customer.username,
        customer.email,
        customer.mobileNumber,
        customer.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./CustomerExcel_" + Date.now() + ".xlsx";
    await workbook.xlsx.writeFile(fileName);
    return new Promise((resolve, reject) => {
      response.download(fileName, (err, data) => {
        if (err) {
          reject(err);
        } else {
          fs.unlinkSync(fileName);
          return response.end();
        }
      });
    });
  }

  // Customer Count API
  /**
   * @api {get} /api/user-customer/customer-count Customer Count API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get customer count",
   *      "data":{},
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/customer-count
   * @apiErrorExample {json} customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/customer-count")
  @Authorized()
  public async customerCounts(@Req() request: any, @Res() response: any): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const customer: any = {};
    const search = [];
    const WhereConditions = [];
    const allCustomerCount = await this.customerService.list(
      0,
      0,
      search,
      WhereConditions,
      0,
      1
    );
    const whereConditionsActive = [
      {
        name: "isActive",
        op: "like",
        value: 1,
      },
    ];
    const activeCustomerCount = await this.customerService.list(
      0,
      0,
      search,
      whereConditionsActive,
      0,
      1
    );
    const whereConditionsInActive = [
      {
        name: "isActive",
        op: "like",
        value: 0,
      },
    ];
    const inActiveCustomerCount = await this.customerService.list(
      0,
      0,
      search,
      whereConditionsInActive,
      0,
      1
    );
    customer.totalCustomer = allCustomerCount;
    customer.activeCustomer = activeCustomerCount;
    customer.inActiveCustomer = inActiveCustomerCount;
    const successResponse: any = {
      status: 1,
      message: "Successfully got the Customer Count",
      data: customer,
    };
    return response.status(200).send(successResponse);
  }

  // Create Customer Token API
  /**
   * @api {post} /api/user-customer/create-customer-token Add Customer Token API
   * @apiGroup User Customer
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerId customerId
   * @apiParam (Request body) {String} cardNumber cardNumber
   * @apiParam (Request body) {String} expiryMonth expiryMonth
   * @apiParam (Request body) {String} expiryYear expiryYear
   * @apiParam (Request body) {String} cvv cvv
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "customerId" : "",
   *      "cardNumber" : "",
   *      "expiryMonth" : "",
   *      "expiryYear" : "",
   *      "cvv" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Customer Token Created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/user-customer/create-customer-token
   * @apiErrorExample {json} Customer Token error
   * HTTP/1.1 500 Internal Server Error
   */
   @Post("/create-customer-token")
   @Authorized()
   public async createCustomerToken(
     @Body({ validate: true }) customerTokenParam: CreateCustomerToken,
     @Req() request: any,
     @Res() response: any
   ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2 && request.user.userGroupId !== 3) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin, Admin and Sales has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }

    // const customerId = customerTokenParam.customerId;
    const branchId = customerTokenParam.branchId;
    const cardNumber = customerTokenParam.cardNumber;
    const expiryMonth = customerTokenParam.expiryMonth;
    const expiryYear = customerTokenParam.expiryYear;
    const cvv = customerTokenParam.cvv;
    const paymentProcessor = await this.gtPaymentGatewayService.getPaymentProcessor(branchId);
    console.log(paymentProcessor);
    const tokenCreation = await this.gtPaymentGatewayService.createToken(cardNumber, expiryMonth, expiryYear, cvv);
    console.log(tokenCreation);

    // const customerPaymentToken = new CustomerPaymentToken();
    // customerPaymentToken.branchId = branchId;
    // customerPaymentToken.customerId = customerId;
    // customerPaymentToken.paymentGatewayId = paymentProcessor.paymentGatewayId;
    // customerPaymentToken.token = tokenCreation.id;
    // customerPaymentToken.isActive = 1;

    // const customerTokenSave = await this.customerPaymentTokenService.create(customerPaymentToken);

    // if (customerTokenSave) {
    //   const successResponse: any = {
    //     status: 1,
    //     message: "Customer Payment Token saved successfully",
    //     data: customerTokenSave,
    //   };
    //   return response.status(200).send(successResponse);
    // } else {
    //   const errorResponse: any = {
    //     status: 0,
    //     message: "unable to save Customer Payment Token",
    //   };
    //   return response.status(400).send(errorResponse);
    // }
   }
}
