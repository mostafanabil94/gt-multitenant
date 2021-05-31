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
import * as AWS from "aws-sdk";
import { classToPlain } from "class-transformer";
// import {aws_setup, env} from '../../env';
import { aws_setup } from "../../../env";
import { CustomerServiceService } from "../../services/CustomerServiceService";
import { CustomerService } from "../../models/CustomerService";
import { CreateCustomerService } from "./requests/CreateCustomerServiceRequest";
import { User } from "../../models/User";
// import {MAILService} from '../../auth/mail.services';
import { UpdateCustomerService } from "./requests/UpdateCustomerServiceRequest";
// import {EmailTemplateService} from '../services/EmailTemplateService';
import { DeleteCustomerServiceRequest } from "./requests/DeleteCustomerServiceRequest";
import * as fs from "fs";

@JsonController("/admin-customer-service")
export class CustomerServiceController {
  constructor(private customerServiceService: CustomerServiceService) {}

  // Create CustomerService API
  /**
   * @api {post} /api/admin-customer-service/add-customer-service Add CustomerService API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} username CustomerService username
   * @apiParam (Request body) {String} email CustomerService email
   * @apiParam (Request body) {Number} mobileNumber CustomerService mobileNumber
   * @apiParam (Request body) {String} password CustomerService password
   * @apiParam (Request body) {String} confirmPassword CustomerService confirmPassword
   * @apiParam (Request body) {String} avatar CustomerService avatar
   * @apiParam (Request body) {Number} mailStatus CustomerService mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status CustomerService status
   * @apiParamExample {json} Input
   * {
   *      "userName" : "",
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
   *      "message": "CustomerService Created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/add-customer-service
   * @apiErrorExample {json} CustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/add-customer-service")
  @Authorized()
  public async addCustomerService(
    @Body({ validate: true }) customerServiceParam: CreateCustomerService,
    @Res() response: any
  ): Promise<any> {
    const avatar = customerServiceParam.avatar;
    const newCustomerService: any = new CustomerService();
    const resultUser = await this.customerServiceService.findOne({
      where: { email: customerServiceParam.email, deleteFlag: 0 },
    });
    if (resultUser) {
      const successResponse: any = {
        status: 1,
        message: "Already registered with this emailId.",
      };
      return response.status(400).send(successResponse);
    }
    if (avatar) {
      const type = avatar.split(";")[0].split("/")[1];
      const name = "Img_" + Date.now() + "." + type;
      const s3 = new AWS.S3();
      const path = "customerService/";
      const base64Data = new Buffer(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const params = {
        Bucket: aws_setup.AWS_BUCKET,
        Key: "customerService/" + name,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
      newCustomerService.avatar = name;
      newCustomerService.avatarPath = path;
      s3.upload(params, (err, data) => {
        if (data) {
          console.log("image upload successfully");
          console.log(data);
        } else {
          console.log("error while uploading image");
        }
      });
    }
    if (
      customerServiceParam.password === customerServiceParam.confirmPassword
    ) {
      const password = await User.hashPassword(customerServiceParam.password);
      newCustomerService.firstName = customerServiceParam.username;
      newCustomerService.username = customerServiceParam.email;
      newCustomerService.email = customerServiceParam.email;
      newCustomerService.mobileNumber = customerServiceParam.mobileNumber;
      newCustomerService.password = password;
      newCustomerService.mailStatus = customerServiceParam.mailStatus;
      newCustomerService.deleteFlag = 0;
      newCustomerService.isActive = customerServiceParam.status;

      const customerServiceSave = await this.customerServiceService.create(
        newCustomerService
      );

      if (customerServiceSave) {
        if (customerServiceParam.mailStatus === 1) {
          // const emailContent = await this.emailTemplateService.findOne(4);
          // const message = emailContent.content.replace('{name}', customerServiceParam.username).replace('{username}', customerServiceParam.email).replace('{password}', customerServiceParam.password);
          // MAILService.customerLoginMail(message, customerServiceParam.email, emailContent.subject, redirectUrl);
          const successResponse: any = {
            status: 1,
            message:
              "Successfully created new CustomerService with user name and password and send an email. ",
            data: customerServiceSave,
          };
          return response.status(200).send(successResponse);
        } else {
          const successResponse: any = {
            status: 1,
            message: "CustomerService Created Successfully",
            data: customerServiceSave,
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

  // Customer Service List API
  /**
   * @api {get} /api/admin-customer-service/customer-service-list Customer Service List API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} name search by name
   * @apiParam (Request body) {String} email search by email
   * @apiParam (Request body) {Number} status 0->inactive 1-> active
   * @apiParam (Request body) {String} date search by date
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get customer service list",
   *      "data":{
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
   * @apiSampleRequest /api/admin-customer-service/customer-service-list
   * @apiErrorExample {json} customerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/customer-service-list")
  @Authorized()
  public async customerServiceList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("name") name: string,
    @QueryParam("status") status: string,
    @QueryParam("email") email: string,
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
    const customerServiceList = await this.customerServiceService.list(
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
        data: customerServiceList,
      };
      return response.status(200).send(successRes);
    }
    const customerService = await Promise.all(customerServiceList);
    const successResponse: any = {
      status: 1,
      message: "Successfully got CustomerService list.",
      data: customerService,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Customer Service API
  /**
   * @api {delete} /api/admin-customer-service/delete-customer-service/:id Delete Customer Service API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "customerServiceId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted Customer Service.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/delete-customer-service/:id
   * @apiErrorExample {json} CustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-customer-service/:id")
  @Authorized()
  public async deleteCustomerService(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const customerService = await this.customerServiceService.findOne({
      where: {
        id,
      },
    });
    if (!customerService) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid customerServiceId",
      };
      return response.status(400).send(errorResponse);
    }
    customerService.deleteFlag = 1;
    const deleteCustomerService = await this.customerServiceService.create(
      customerService
    );
    if (deleteCustomerService) {
      const successResponse: any = {
        status: 1,
        message: "CustomerService Deleted Successfully",
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

  // Update Customer Service API
  /**
   * @api {put} /api/admin-customer-service/update-customer-service/:id Update Customer Service API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} username CustomerService username
   * @apiParam (Request body) {String} email CustomerService email
   * @apiParam (Request body) {Number} mobileNumber CustomerService mobileNumber
   * @apiParam (Request body) {String} password CustomerService password
   * @apiParam (Request body) {String} confirmPassword CustomerService confirmPassword
   * @apiParam (Request body) {String} avatar CustomerService avatar
   * @apiParam (Request body) {Number} mailStatus CustomerService mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status CustomerService status
   * @apiParamExample {json} Input
   * {
   *      "userName" : "",
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
   *      "message": " CustomerService is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/update-customer-service/:id
   * @apiErrorExample {json} updateCustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-customer-service/:id")
  @Authorized()
  public async updateCustomerService(
    @Param("id") id: number,
    @Body({ validate: true }) customerServiceParam: UpdateCustomerService,
    @Res() response: any
  ): Promise<any> {
    console.log(customerServiceParam);
    const customerService = await this.customerServiceService.findOne({
      where: {
        id,
      },
    });
    if (!customerService) {
      const errorResponse: any = {
        status: 0,
        message: "invalid customerService id",
      };
      return response.status(400).send(errorResponse);
    }
    if (
      customerServiceParam.password === customerServiceParam.confirmPassword
    ) {
      const avatar = customerServiceParam.avatar;
      if (avatar) {
        const type = avatar.split(";")[0].split("/")[1];
        const name = "Img_" + Date.now() + "." + type;
        const s3 = new AWS.S3();
        const path = "customerService/";
        const base64Data = new Buffer(
          avatar.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const params = {
          Bucket: aws_setup.AWS_BUCKET,
          Key: "customerService/" + name,
          Body: base64Data,
          ACL: "public-read",
          ContentEncoding: "base64",
          ContentType: `image/${type}`,
        };
        s3.upload(params, (err, data) => {
          if (data) {
            console.log("image upload successfully");
            console.log(data);
          } else {
            console.log("error while uploading image");
          }
        });
        customerService.avatar = name;
        customerService.avatarPath = path;
      }
      customerService.firstName = customerServiceParam.username;
      customerService.username = customerServiceParam.email;
      customerService.email = customerServiceParam.email;
      customerService.mobileNumber = customerServiceParam.mobileNumber;
      if (customerServiceParam.password) {
        const password = await User.hashPassword(customerServiceParam.password);
        customerService.password = password;
      }
      customerService.mailStatus = customerServiceParam.mailStatus;
      customerService.isActive = customerServiceParam.status;
      const customerServiceSave = await this.customerServiceService.create(
        customerService
      );
      if (customerServiceSave) {
        const successResponse: any = {
          status: 1,
          message: "CustomerService Updated Successfully",
          data: customerServiceSave,
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

  // Get Customer Service Detail API
  /**
   * @api {get} /api/admin-customer-service/customer-service-details/:id Customer Service Details API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully get customerService Details",
   * "data":{
   * "username" : "",
   * "email" : "",
   * "mobileNumber" : "",
   * "password" : "",
   * "avatar" : "",
   * "avatarPath" : "",
   * "status" : "",
   * }
   * "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/customer-service-details/:id
   * @apiErrorExample {json} customerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/customer-service-details/:id")
  @Authorized()
  public async customerServiceDetails(
    @Param("id") Id: number,
    @Res() response: any
  ): Promise<any> {
    const customerService = await this.customerServiceService.findOne({
      select: [
        "customerServiceId",
        "firstName",
        "email",
        "mobileNumber",
        "address",
        "lastLogin",
        "isActive",
        "mailStatus",
      ],
      where: { customerServiceId: Id },
    });
    if (!customerService) {
      const errorResponse: any = {
        status: 0,
        message: "invalid customerServiceId",
      };
      return response.status(400).send(errorResponse);
    }

    const successResponse: any = {
      status: 1,
      message: "successfully got CustomerService details. ",
      data: customerService,
    };
    return response.status(200).send(successResponse);
  }

  // Recently Added Customer Service List API
  /**
   * @api {get} /api/admin-customer-service/recent-customer-service-list Recent Customer Service List API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "status": "1"
   *      "message": "Successfully get customerService list",
   *      "data":{
   *      "location" : "",
   *      "name" : "",
   *      "created date" : "",
   *      "isActive" : "",
   *      }
   * }
   * @apiSampleRequest /api/admin-customer-service/recent-customer-service-list
   * @apiErrorExample {json} customerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/recent-customer-service-list")
  @Authorized()
  public async recentCustomerServiceList(@Res() response: any): Promise<any> {
    const order = 1;
    const WhereConditions = [
      {
        name: "deleteFlag",
        value: 0,
      },
    ];
    const customerServiceList = await this.customerServiceService.list(
      0,
      0,
      0,
      WhereConditions,
      order,
      0
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully got customerService list.",
      data: classToPlain(customerServiceList),
    };

    return response.status(200).send(successResponse);
  }

  //  Today Customer Service Count API
  /**
   * @api {get} /api/admin-customer-service/today-customer-service-count Today Customer Service Count API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get Today customer Service count",
   *      "data":{
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/today-customer-service-count
   * @apiErrorExample {json} today customerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/today-customer-service-count")
  @Authorized()
  public async customerServiceCount(@Res() response: any): Promise<any> {
    const nowDate = new Date();
    const todaydate =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();
    const customerServiceCount =
      await this.customerServiceService.todayCustomerServiceCount(todaydate);
    const successResponse: any = {
      status: 1,
      message: "Successfully get customerServiceCount",
      data: customerServiceCount,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Multiple Customer Service API
  /**
   * @api {post} /api/admin-customer-service/delete-customer-service Delete Multiple Customer Service API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {number} customerServiceId customerServiceId
   * @apiParamExample {json} Input
   * {
   * "customerServiceId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully deleted customerService.",
   * "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/delete-customer-service
   * @apiErrorExample {json} customerServiceDelete error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/delete-customer-service")
  @Authorized()
  public async deleteMultipleCustomerService(
    @Body({ validate: true })
    deleteCustomerServiceId: DeleteCustomerServiceRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const customerServices =
      deleteCustomerServiceId.customerServiceId.toString();
    const customerService: any = customerServices.split(",");
    console.log(customerService);
    const data: any = customerService.map(async (id: any) => {
      const dataId = await this.customerServiceService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Please choose customerService for delete",
        };
        return response.status(400).send(errorResponse);
      } else {
        dataId.deleteFlag = 1;
        return await this.customerServiceService.create(dataId);
      }
    });
    const deleteCustomerService = await Promise.all(data);
    if (deleteCustomerService) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted customerService",
      };
      return response.status(200).send(successResponse);
    }
  }

  // Customer Service Details Excel Document Download
  /**
   * @api {get} /api/admin-customer-service/customer-service-excel-list Customer Service Excel
   * @apiGroup Admin Customer Service
   * @apiParam (Request body) {String} customerServiceId customerServiceId
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the CustomerService Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/admin-customer-service/customer-service-excel-list
   * @apiErrorExample {json} CustomerService Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/customer-service-excel-list")
  public async excelCustomerServiceView(
    @QueryParam("customerServiceId") customerServiceId: string,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("CustomerService Export sheet");
    const rows = [];
    const customerServiceid = customerServiceId.split(",");
    for (const id of customerServiceid) {
      const dataId = await this.customerServiceService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Invalid customerServiceId",
        };
        return response.status(400).send(errorResponse);
      }
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Customer Service Id", key: "id", size: 16, width: 15 },
      {
        header: "Customer Service Name",
        key: "first_name",
        size: 16,
        width: 15,
      },
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
    for (const id of customerServiceid) {
      const dataId = await this.customerServiceService.findOne(id);
      if (dataId.lastName === null) {
        dataId.lastName = "";
      }
      rows.push([
        dataId.customerServiceId,
        dataId.firstName + " " + dataId.lastName,
        dataId.username,
        dataId.email,
        dataId.mobileNumber,
        dataId.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./CustomerServiceExcel_" + Date.now() + ".xlsx";
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

  // Customer Service Details Excel Document Download
  /**
   * @api {get} /api/admin-customer-service/all-customer-service-excel-list All Customer Service Excel
   * @apiGroup Admin Customer Service
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the All Customer Service Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/admin-customer-service/all-customer-service-excel-list
   * @apiErrorExample {json} All CustomerService Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/all-customer-service-excel-list")
  public async allCustomerServiceExcel(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Bulk Customer Service Export");
    const rows = [];
    const dataId = await this.customerServiceService.findAll();
    if (dataId === undefined) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid customerServiceId",
      };
      return response.status(400).send(errorResponse);
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Customer Service Id", key: "id", size: 16, width: 15 },
      {
        header: "Customer Service Name",
        key: "first_name",
        size: 16,
        width: 15,
      },
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
    const customerServices = await this.customerServiceService.findAll();
    for (const customerService of customerServices) {
      if (customerService.lastName === null) {
        customerService.lastName = "";
      }
      rows.push([
        customerService.customerServiceId,
        customerService.firstName + " " + customerService.lastName,
        customerService.username,
        customerService.email,
        customerService.mobileNumber,
        customerService.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./CustomerServiceExcel_" + Date.now() + ".xlsx";
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

  // Customer Service Count API
  /**
   * @api {get} /api/admin-customer-service/customer-service-count Customer Service Count API
   * @apiGroup Admin Customer Service
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get customer Service count",
   *      "data":{},
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-customer-service/customer-service-count
   * @apiErrorExample {json} customerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/customer-service-count")
  @Authorized()
  public async customerServiceCounts(@Res() response: any): Promise<any> {
    const customerService: any = {};
    const search = [];
    const WhereConditions = [];
    const allCustomerServiceCount = await this.customerServiceService.list(
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
    const activeCustomerServiceCount = await this.customerServiceService.list(
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
    const inActiveCustomerServiceCount = await this.customerServiceService.list(
      0,
      0,
      search,
      whereConditionsInActive,
      0,
      1
    );
    customerService.totalCustomerService = allCustomerServiceCount;
    customerService.activeCustomerService = activeCustomerServiceCount;
    customerService.inActiveCustomerService = inActiveCustomerServiceCount;
    const successResponse: any = {
      status: 1,
      message: "Successfully got the CustomerService Count",
      data: customerService,
    };
    return response.status(200).send(successResponse);
  }
}
