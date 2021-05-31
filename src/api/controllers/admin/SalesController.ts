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
import { SalesService } from "../../services/SalesService";
import { Sales } from "../../models/Sales";
import { CreateSales } from "./requests/CreateSalesRequest";
import { User } from "../../models/User";
// import {MAILService} from '../../auth/mail.services';
import { UpdateSales } from "./requests/UpdateSalesRequest";
// import {EmailTemplateService} from '../services/EmailTemplateService';
import { DeleteSalesRequest } from "./requests/DeleteSalesRequest";
import * as fs from "fs";

@JsonController("/admin-sales")
export class SalesController {
  constructor(private salesService: SalesService) {}

  // Create Sales API
  /**
   * @api {post} /api/admin-sales/add-sales Add Sales API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} username Sales username
   * @apiParam (Request body) {String} email Sales email
   * @apiParam (Request body) {Number} mobileNumber Sales mobileNumber
   * @apiParam (Request body) {String} password Sales password
   * @apiParam (Request body) {String} confirmPassword Sales confirmPassword
   * @apiParam (Request body) {String} avatar Sales avatar
   * @apiParam (Request body) {Number} mailStatus Sales mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status Sales status
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
   *      "message": "Sales Created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-sales/add-sales
   * @apiErrorExample {json} Sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/add-sales")
  @Authorized()
  public async addSales(
    @Body({ validate: true }) salesParam: CreateSales,
    @Res() response: any
  ): Promise<any> {
    const avatar = salesParam.avatar;
    const newSales: any = new Sales();
    const resultUser = await this.salesService.findOne({
      where: { email: salesParam.email, deleteFlag: 0 },
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
      const path = "sales/";
      const base64Data = new Buffer(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const params = {
        Bucket: aws_setup.AWS_BUCKET,
        Key: "sales/" + name,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
      newSales.avatar = name;
      newSales.avatarPath = path;
      s3.upload(params, (err, data) => {
        if (data) {
          console.log("image upload successfully");
          console.log(data);
        } else {
          console.log("error while uploading image");
        }
      });
    }
    if (salesParam.password === salesParam.confirmPassword) {
      const password = await User.hashPassword(salesParam.password);
      newSales.firstName = salesParam.username;
      newSales.username = salesParam.email;
      newSales.email = salesParam.email;
      newSales.mobileNumber = salesParam.mobileNumber;
      newSales.password = password;
      newSales.mailStatus = salesParam.mailStatus;
      newSales.deleteFlag = 0;
      newSales.isActive = salesParam.status;

      const salesSave = await this.salesService.create(newSales);

      if (salesSave) {
        if (salesParam.mailStatus === 1) {
          // const emailContent = await this.emailTemplateService.findOne(4);
          // const message = emailContent.content.replace('{name}', salesParam.username).replace('{username}', salesParam.email).replace('{password}', salesParam.password);
          // MAILService.customerLoginMail(message, salesParam.email, emailContent.subject, redirectUrl);
          const successResponse: any = {
            status: 1,
            message:
              "Successfully created new Sales with user name and password and send an email. ",
            data: salesSave,
          };
          return response.status(200).send(successResponse);
        } else {
          const successResponse: any = {
            status: 1,
            message: "Sales Created Successfully",
            data: salesSave,
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

  // Sales List API
  /**
   * @api {get} /api/admin-sales/sales-list Sales List API
   * @apiGroup Admin Sales
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
   *      "message": "Successfully get fitness list",
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
   * @apiSampleRequest /api/admin-sales/sales-list
   * @apiErrorExample {json} sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/sales-list")
  @Authorized()
  public async salesList(
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
    const salesList = await this.salesService.list(
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
        data: salesList,
      };
      return response.status(200).send(successRes);
    }
    const sales = await Promise.all(salesList);
    const successResponse: any = {
      status: 1,
      message: "Successfully got Sales list.",
      data: sales,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Sales API
  /**
   * @api {delete} /api/admin-sales/delete-sales/:id Delete Sales API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "salesId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted sales.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-sales/delete-sales/:id
   * @apiErrorExample {json} Sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-sales/:id")
  @Authorized()
  public async deleteSales(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const sales = await this.salesService.findOne({
      where: {
        id,
      },
    });
    if (!sales) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid salesId",
      };
      return response.status(400).send(errorResponse);
    }
    sales.deleteFlag = 1;
    const deleteSales = await this.salesService.create(sales);
    if (deleteSales) {
      const successResponse: any = {
        status: 1,
        message: "Sales Deleted Successfully",
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

  // Update Sales API
  /**
   * @api {put} /api/admin-sales/update-sales/:id Update Sales API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} username Sales username
   * @apiParam (Request body) {String} email Sales email
   * @apiParam (Request body) {Number} mobileNumber Sales mobileNumber
   * @apiParam (Request body) {String} password Sales password
   * @apiParam (Request body) {String} confirmPassword Sales confirmPassword
   * @apiParam (Request body) {String} avatar Sales avatar
   * @apiParam (Request body) {Number} mailStatus Sales mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status Sales status
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
   *      "message": " Sales is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-sales/update-sales/:id
   * @apiErrorExample {json} updateSales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-sales/:id")
  @Authorized()
  public async updateSales(
    @Param("id") id: number,
    @Body({ validate: true }) salesParam: UpdateSales,
    @Res() response: any
  ): Promise<any> {
    console.log(salesParam);
    const sales = await this.salesService.findOne({
      where: {
        id,
      },
    });
    if (!sales) {
      const errorResponse: any = {
        status: 0,
        message: "invalid sales id",
      };
      return response.status(400).send(errorResponse);
    }
    if (salesParam.password === salesParam.confirmPassword) {
      const avatar = salesParam.avatar;
      if (avatar) {
        const type = avatar.split(";")[0].split("/")[1];
        const name = "Img_" + Date.now() + "." + type;
        const s3 = new AWS.S3();
        const path = "sales/";
        const base64Data = new Buffer(
          avatar.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const params = {
          Bucket: aws_setup.AWS_BUCKET,
          Key: "sales/" + name,
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
        sales.avatar = name;
        sales.avatarPath = path;
      }
      sales.firstName = salesParam.username;
      sales.username = salesParam.email;
      sales.email = salesParam.email;
      sales.mobileNumber = salesParam.mobileNumber;
      if (salesParam.password) {
        const password = await User.hashPassword(salesParam.password);
        sales.password = password;
      }
      sales.mailStatus = salesParam.mailStatus;
      sales.isActive = salesParam.status;
      const salesSave = await this.salesService.create(sales);
      if (salesSave) {
        const successResponse: any = {
          status: 1,
          message: "Sales Updated Successfully",
          data: salesSave,
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

  // Get Sales Detail API
  /**
   * @api {get} /api/admin-sales/sales-details/:id Sales Details API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully get sales Details",
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
   * @apiSampleRequest /api/admin-sales/sales-details/:id
   * @apiErrorExample {json} sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/sales-details/:id")
  @Authorized()
  public async salesDetails(
    @Param("id") Id: number,
    @Res() response: any
  ): Promise<any> {
    const sales = await this.salesService.findOne({
      select: [
        "salesId",
        "firstName",
        "email",
        "mobileNumber",
        "address",
        "lastLogin",
        "isActive",
        "mailStatus",
      ],
      where: { salesId: Id },
    });
    if (!sales) {
      const errorResponse: any = {
        status: 0,
        message: "invalid salesId",
      };
      return response.status(400).send(errorResponse);
    }

    const successResponse: any = {
      status: 1,
      message: "successfully got Sales details. ",
      data: sales,
    };
    return response.status(200).send(successResponse);
  }

  // Recently Added Sales List API
  /**
   * @api {get} /api/admin-sales/recent-sales-list Recent Sales List API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "status": "1"
   *      "message": "Successfully get sales list",
   *      "data":{
   *      "location" : "",
   *      "name" : "",
   *      "created date" : "",
   *      "isActive" : "",
   *      }
   * }
   * @apiSampleRequest /api/admin-sales/recent-sales-list
   * @apiErrorExample {json} sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/recent-sales-list")
  @Authorized()
  public async recentSalesList(@Res() response: any): Promise<any> {
    const order = 1;
    const WhereConditions = [
      {
        name: "deleteFlag",
        value: 0,
      },
    ];
    const salesList = await this.salesService.list(
      0,
      0,
      0,
      WhereConditions,
      order,
      0
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully got sales list.",
      data: classToPlain(salesList),
    };

    return response.status(200).send(successResponse);
  }

  //  Today Sales Count API
  /**
   * @api {get} /api/admin-sales/today-sales-count Today Sales Count API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get Today sales count",
   *      "data":{
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-sales/today-sales-count
   * @apiErrorExample {json} today sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/today-sales-count")
  @Authorized()
  public async salesCount(@Res() response: any): Promise<any> {
    const nowDate = new Date();
    const todaydate =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();
    const salesCount = await this.salesService.todaySalesCount(todaydate);
    const successResponse: any = {
      status: 1,
      message: "Successfully get salesCount",
      data: salesCount,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Multiple Sales API
  /**
   * @api {post} /api/admin-sales/delete-sales Delete Multiple Sales API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {number} salesId salesId
   * @apiParamExample {json} Input
   * {
   * "salesId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully deleted sales.",
   * "status": "1"
   * }
   * @apiSampleRequest /api/admin-sales/delete-sales
   * @apiErrorExample {json} salesDelete error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/delete-sales")
  @Authorized()
  public async deleteMultipleSales(
    @Body({ validate: true }) deleteSalesId: DeleteSalesRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const saless = deleteSalesId.salesId.toString();
    const sales: any = saless.split(",");
    console.log(sales);
    const data: any = sales.map(async (id: any) => {
      const dataId = await this.salesService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Please choose sales for delete",
        };
        return response.status(400).send(errorResponse);
      } else {
        dataId.deleteFlag = 1;
        return await this.salesService.create(dataId);
      }
    });
    const deleteSales = await Promise.all(data);
    if (deleteSales) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted sales",
      };
      return response.status(200).send(successResponse);
    }
  }

  // Sales Details Excel Document Download
  /**
   * @api {get} /api/admin-sales/sales-excel-list Sales Excel
   * @apiGroup Admin Sales
   * @apiParam (Request body) {String} salesId salesId
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the Sales Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/admin-sales/sales-excel-list
   * @apiErrorExample {json} Sales Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/sales-excel-list")
  public async excelSalesView(
    @QueryParam("salesId") salesId: string,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Sales Export sheet");
    const rows = [];
    const salesid = salesId.split(",");
    for (const id of salesid) {
      const dataId = await this.salesService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Invalid salesId",
        };
        return response.status(400).send(errorResponse);
      }
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Sales Id", key: "id", size: 16, width: 15 },
      { header: "Sales Name", key: "first_name", size: 16, width: 15 },
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
    for (const id of salesid) {
      const dataId = await this.salesService.findOne(id);
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
    const fileName = "./SalesExcel_" + Date.now() + ".xlsx";
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

  // Sales Details Excel Document Download
  /**
   * @api {get} /api/admin-sales/all-sales-excel-list All Sales Excel
   * @apiGroup Admin Sales
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the All Sales Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/admin-sales/all-sales-excel-list
   * @apiErrorExample {json} All Sales Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/all-sales-excel-list")
  public async allSalesExcel(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Bulk Sales Export");
    const rows = [];
    const dataId = await this.salesService.findAll();
    if (dataId === undefined) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid salesId",
      };
      return response.status(400).send(errorResponse);
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Sales Id", key: "id", size: 16, width: 15 },
      { header: "Sales Name", key: "first_name", size: 16, width: 15 },
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
    const saless = await this.salesService.findAll();
    for (const sales of saless) {
      if (sales.lastName === null) {
        sales.lastName = "";
      }
      rows.push([
        sales.id,
        sales.firstName + " " + sales.lastName,
        sales.username,
        sales.email,
        sales.mobileNumber,
        sales.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./SalesExcel_" + Date.now() + ".xlsx";
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

  // Sales Count API
  /**
   * @api {get} /api/admin-sales/sales-count Sales Count API
   * @apiGroup Admin Sales
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get sales count",
   *      "data":{},
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-sales/sales-count
   * @apiErrorExample {json} sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/sales-count")
  @Authorized()
  public async salesCounts(@Res() response: any): Promise<any> {
    const sales: any = {};
    const search = [];
    const WhereConditions = [];
    const allSalesCount = await this.salesService.list(
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
    const activeSalesCount = await this.salesService.list(
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
    const inActiveSalesCount = await this.salesService.list(
      0,
      0,
      search,
      whereConditionsInActive,
      0,
      1
    );
    sales.totalSales = allSalesCount;
    sales.activeSales = activeSalesCount;
    sales.inActiveSales = inActiveSalesCount;
    const successResponse: any = {
      status: 1,
      message: "Successfully got the Sales Count",
      data: sales,
    };
    return response.status(200).send(successResponse);
  }
}
