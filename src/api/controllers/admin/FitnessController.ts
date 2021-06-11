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
import { FitnessService } from "../../services/FitnessService";
import { Fitness } from "../../models/Fitness";
import { CreateFitness } from "./requests/CreateFitnessRequest";
import { User } from "../../models/User";
// import {MAILService} from '../../auth/mail.services';
import { UpdateFitness } from "./requests/UpdateFitnessRequest";
// import {EmailTemplateService} from '../services/EmailTemplateService';
import { DeleteFitnessRequest } from "./requests/DeleteFitnessRequest";
import * as fs from "fs";

@JsonController("/admin-fitness")
export class FitnessController {
  constructor(private fitnessService: FitnessService) {}

  // Create Fitness API
  /**
   * @api {post} /api/admin-fitness/add-fitness Add Fitness API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} username Fitness username
   * @apiParam (Request body) {String} email Fitness email
   * @apiParam (Request body) {Number} mobileNumber Fitness mobileNumber
   * @apiParam (Request body) {String} password Fitness password
   * @apiParam (Request body) {String} confirmPassword Fitness confirmPassword
   * @apiParam (Request body) {String} avatar Fitness avatar
   * @apiParam (Request body) {Number} mailStatus Fitness mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status Fitness status
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
   *      "message": "Fitness Created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-fitness/add-fitness
   * @apiErrorExample {json} Fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/add-fitness")
  @Authorized()
  public async addFitness(
    @Body({ validate: true }) fitnessParam: CreateFitness,
    @Res() response: any
  ): Promise<any> {
    const avatar = fitnessParam.avatar;
    const newFitness: any = new Fitness();
    const resultUser = await this.fitnessService.findOne({
      where: { email: fitnessParam.email, deleteFlag: 0 },
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
      const path = "fitness/";
      const base64Data = new Buffer(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const params = {
        Bucket: aws_setup.AWS_BUCKET,
        Key: "fitness/" + name,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
      newFitness.avatar = name;
      newFitness.avatarPath = path;
      s3.upload(params, (err, data) => {
        if (data) {
          console.log("image upload successfully");
          console.log(data);
        } else {
          console.log("error while uploading image");
        }
      });
    }
    if (fitnessParam.password === fitnessParam.confirmPassword) {
      const password = await User.hashPassword(fitnessParam.password);
      newFitness.firstName = fitnessParam.firstName;
      newFitness.lastName = fitnessParam.lastName;
      newFitness.username = fitnessParam.username;
      newFitness.email = fitnessParam.email;
      newFitness.mobileNumber = fitnessParam.mobileNumber;
      newFitness.password = password;
      newFitness.mailStatus = fitnessParam.mailStatus;
      newFitness.newsletter = fitnessParam.newsletter;
      newFitness.deleteFlag = 0;
      newFitness.isActive = fitnessParam.status;

      const fitnessSave = await this.fitnessService.create(newFitness);

      if (fitnessSave) {
        if (fitnessParam.mailStatus === 1) {
          // const emailContent = await this.emailTemplateService.findOne(4);
          // const message = emailContent.content.replace('{name}', fitnessParam.username).replace('{username}', fitnessParam.email).replace('{password}', fitnessParam.password);
          // MAILService.customerLoginMail(message, fitnessParam.email, emailContent.subject, redirectUrl);
          const successResponse: any = {
            status: 1,
            message:
              "Successfully created new Fitness with user name and password and send an email. ",
            data: fitnessSave,
          };
          return response.status(200).send(successResponse);
        } else {
          const successResponse: any = {
            status: 1,
            message: "Fitness Created Successfully",
            data: fitnessSave,
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

  // Fitness List API
  /**
   * @api {get} /api/admin-fitness/fitnesslist Fitnedd List API
   * @apiGroup Admin Fitness
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
   * @apiSampleRequest /api/admin-fitness/fitnesslist
   * @apiErrorExample {json} fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/fitnesslist")
  @Authorized()
  public async fitnessList(
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
    const relation = [];

    const select = [];

    const fitnessList = await this.fitnessService.list(
      limit,
      offset,
      select,
      search,
      WhereConditions,
      relation,
      count
    );
    console.log(fitnessList);
    if (count) {
      const successRes: any = {
        status: 1,
        message: "Successfully got count ",
        data: fitnessList,
      };
      return response.status(200).send(successRes);
    }
    const fitness = await Promise.all(fitnessList);
    const successResponse: any = {
      status: 1,
      message: "Successfully got Fitness list.",
      data: fitness,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Fitness API
  /**
   * @api {delete} /api/admin-fitness/delete-fitness/:id Delete Fitness API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "fitnessId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted fitness.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-fitness/delete-fitness/:id
   * @apiErrorExample {json} Fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-fitness/:id")
  @Authorized()
  public async deleteFitness(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const fitness = await this.fitnessService.findOne({
      where: {
        id,
      },
    });
    if (!fitness) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid fitnessId",
      };
      return response.status(400).send(errorResponse);
    }
    fitness.deleteFlag = 1;
    const deleteFitness = await this.fitnessService.create(fitness);
    if (deleteFitness) {
      const successResponse: any = {
        status: 1,
        message: "Fitness Deleted Successfully",
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

  // Update Fitness API
  /**
   * @api {put} /api/admin-fitness/update-fitness/:id Update Fitness API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} username Fitness username
   * @apiParam (Request body) {String} email Fitness email
   * @apiParam (Request body) {Number} mobileNumber Fitness mobileNumber
   * @apiParam (Request body) {String} password Fitness password
   * @apiParam (Request body) {String} confirmPassword Fitness confirmPassword
   * @apiParam (Request body) {String} avatar Fitness avatar
   * @apiParam (Request body) {Number} mailStatus Fitness mailStatus should be 1 or 0
   * @apiParam (Request body) {Number} status Fitness status
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
   *      "message": " Fitness is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-fitness/update-fitness/:id
   * @apiErrorExample {json} updateFitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-fitness/:id")
  @Authorized()
  public async updateFitness(
    @Param("id") id: number,
    @Body({ validate: true }) fitnessParam: UpdateFitness,
    @Res() response: any
  ): Promise<any> {
    console.log(fitnessParam);
    const fitness = await this.fitnessService.findOne({
      where: {
        fitnessId: id,
      },
    });
    if (!fitness) {
      const errorResponse: any = {
        status: 0,
        message: "invalid fitness id",
      };
      return response.status(400).send(errorResponse);
    }
    if (fitnessParam.password === fitnessParam.confirmPassword) {
      const avatar = fitnessParam.avatar;
      if (avatar) {
        const type = avatar.split(";")[0].split("/")[1];
        const name = "Img_" + Date.now() + "." + type;
        const s3 = new AWS.S3();
        const path = "fitness/";
        const base64Data = new Buffer(
          avatar.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const params = {
          Bucket: aws_setup.AWS_BUCKET,
          Key: "fitness/" + name,
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
        fitness.avatar = name;
        fitness.avatarPath = path;
      }
      fitness.firstName = fitnessParam.firstName;
      fitness.lastName = fitnessParam.lastName;
      fitness.username = fitnessParam.username;
      fitness.email = fitnessParam.email;
      fitness.mobileNumber = fitnessParam.mobileNumber;
      if (fitnessParam.password) {
        const password = await User.hashPassword(fitnessParam.password);
        fitness.password = password;
      }
      fitness.mailStatus = fitnessParam.mailStatus;
      fitness.newsletter = fitnessParam.newsletter;
      fitness.isActive = fitnessParam.status;
      const fitnessSave = await this.fitnessService.create(fitness);
      if (fitnessSave) {
        const successResponse: any = {
          status: 1,
          message: "Fitness Updated Successfully",
          data: fitnessSave,
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

  // Get Fitness Detail API
  /**
   * @api {get} /api/admin-fitness/fitness-details/:id Fitness Details API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully get fitness Details",
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
   * @apiSampleRequest /api/admin-fitness/fitness-details/:id
   * @apiErrorExample {json} fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/fitness-details/:id")
  @Authorized()
  public async fitnessDetails(
    @Param("id") id: number,
    @Res() response: any
  ): Promise<any> {
    const fitness = await this.fitnessService.findOne({
      select: [
        "fitnessId",
        "firstName",
        "email",
        "mobileNumber",
        "address",
        "lastLogin",
        "isActive",
        "mailStatus",
      ],
      where: { fitnessId: id },
    });
    if (!fitness) {
      const errorResponse: any = {
        status: 0,
        message: "invalid fitnessId",
      };
      return response.status(400).send(errorResponse);
    }

    const successResponse: any = {
      status: 1,
      message: "successfully got Fitness details. ",
      data: fitness,
    };
    return response.status(200).send(successResponse);
  }

  // Recently Added Fitness List API
  /**
   * @api {get} /api/admin-fitness/recent-fitness-list Recent Fitness List API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "status": "1"
   *      "message": "Successfully get fitness list",
   *      "data":{
   *      "location" : "",
   *      "name" : "",
   *      "created date" : "",
   *      "isActive" : "",
   *      }
   * }
   * @apiSampleRequest /api/admin-fitness/recent-fitness-list
   * @apiErrorExample {json} fitness- error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/recent-fitness-list")
  @Authorized()
  public async recentFitnessList(@Res() response: any): Promise<any> {
    const order = 1;
    const WhereConditions = [
      {
        name: "deleteFlag",
        value: 0,
      },
    ];
    const relation = [];
    const fitnessList = await this.fitnessService.list(
      0,
      0,
      0,
      WhereConditions,
      order,
      relation,
      0
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully got fitness list.",
      data: classToPlain(fitnessList),
    };

    return response.status(200).send(successResponse);
  }

  //  Today Fitness Count API
  /**
   * @api {get} /api/admin-fitness/today-fitness-count Today Fitness Count API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get Today fitness count",
   *      "data":{
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-fitness/today-fitness-count
   * @apiErrorExample {json} today fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/today-fitness-count")
  @Authorized()
  public async fitnessCount(@Res() response: any): Promise<any> {
    const nowDate = new Date();
    const todaydate =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();
    const fitnessCount = await this.fitnessService.todayFitnessCount(todaydate);
    const successResponse: any = {
      status: 1,
      message: "Successfully get fitnessCount",
      data: fitnessCount,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Multiple Fitness API
  /**
   * @api {post} /api/admin-fitness/delete-fitness Delete Multiple Fitness API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {number} fitnessId fitnessId
   * @apiParamExample {json} Input
   * {
   * "fitnessId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   * "message": "Successfully deleted fitness.",
   * "status": "1"
   * }
   * @apiSampleRequest /api/admin-fitness/delete-fitness
   * @apiErrorExample {json} fitnessDelete error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/delete-fitness")
  @Authorized()
  public async deleteMultipleFitness(
    @Body({ validate: true }) deleteFitnessId: DeleteFitnessRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const fitnesss = deleteFitnessId.fitnessId.toString();
    const fitness: any = fitnesss.split(",");
    console.log(fitness);
    const data: any = fitness.map(async (id: any) => {
      const dataId = await this.fitnessService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Please choose fitness for delete",
        };
        return response.status(400).send(errorResponse);
      } else {
        dataId.deleteFlag = 1;
        return await this.fitnessService.create(dataId);
      }
    });
    const deleteFitness = await Promise.all(data);
    if (deleteFitness) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted fitness",
      };
      return response.status(200).send(successResponse);
    }
  }

  // Fitness Details Excel Document Download
  /**
   * @api {get} /api/admin-fitness/fitness-excel-list Fitness Excel
   * @apiGroup Admin Fitness
   * @apiParam (Request body) {String} fitnessId fitnessId
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the Fitness Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/admin-fitness/fitness-excel-list
   * @apiErrorExample {json} Fitness Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/fitness-excel-list")
  public async excelFitnessView(
    @QueryParam("fitnessId") fitnessId: string,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Fitness Export sheet");
    const rows = [];
    const fitnessid = fitnessId.split(",");
    for (const id of fitnessid) {
      const dataId = await this.fitnessService.findOne(id);
      if (dataId === undefined) {
        const errorResponse: any = {
          status: 0,
          message: "Invalid fitnessId",
        };
        return response.status(400).send(errorResponse);
      }
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Fitness Id", key: "id", size: 16, width: 15 },
      { header: "Fitness Name", key: "first_name", size: 16, width: 15 },
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
    for (const id of fitnessid) {
      const dataId = await this.fitnessService.findOne(id);
      if (dataId.lastName === null) {
        dataId.lastName = "";
      }
      rows.push([
        dataId.fitnessId,
        dataId.firstName + " " + dataId.lastName,
        dataId.username,
        dataId.email,
        dataId.mobileNumber,
        dataId.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./FitnessExcel_" + Date.now() + ".xlsx";
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

  // Fitness Details Excel Document Download
  /**
   * @api {get} /api/admin-fitness/all-fitness-excel-list All Fitness Excel
   * @apiGroup Admin Fitness
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully download the All Fitness Excel List..!!",
   *      "status": "1",
   *      "data": {},
   * }
   * @apiSampleRequest /api/admin-fitness/all-fitness-excel-list
   * @apiErrorExample {json} All Fitness Excel List error
   * HTTP/1.1 500 Internal Server Error
   */

  @Get("/all-fitness-excel-list")
  public async allFitnessExcel(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const excel = require("exceljs");
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Bulk Fitness Export");
    const rows = [];
    const dataId = await this.fitnessService.findAll();
    if (dataId === undefined) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid fitnessId",
      };
      return response.status(400).send(errorResponse);
    }
    // Excel sheet column define
    worksheet.columns = [
      { header: "Fitness Id", key: "id", size: 16, width: 15 },
      { header: "Fitness Name", key: "first_name", size: 16, width: 15 },
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
    const fitnesss = await this.fitnessService.findAll();
    for (const fitness of fitnesss) {
      if (fitness.lastName === null) {
        fitness.lastName = "";
      }
      rows.push([
        fitness.fitnessId,
        fitness.firstName + " " + fitness.lastName,
        fitness.username,
        fitness.email,
        fitness.mobileNumber,
        fitness.createdDate,
      ]);
    }
    // Add all rows data in sheet
    worksheet.addRows(rows);
    const fileName = "./FitnessExcel_" + Date.now() + ".xlsx";
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

  // Fitness Count API
  /**
   * @api {get} /api/admin-fitness/fitness-count Fitness Count API
   * @apiGroup Admin Fitness
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get fitness count",
   *      "data":{},
   *      "status": "1"
   * }
   * @apiSampleRequest /api/admin-fitness/fitness-count
   * @apiErrorExample {json} fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/fitness-count")
  @Authorized()
  public async fitnessCounts(@Res() response: any): Promise<any> {
    const fitness: any = {};
    const search = [];
    const WhereConditions = [];
    const relation = [];
    const allFitnessCount = await this.fitnessService.list(
      0,
      0,
      search,
      WhereConditions,
      0,
      relation,
      1
    );
    const whereConditionsActive = [
      {
        name: "isActive",
        op: "like",
        value: 1,
      },
    ];
    const activeFitnessCount = await this.fitnessService.list(
      0,
      0,
      search,
      whereConditionsActive,
      0,
      relation,
      1
    );
    const whereConditionsInActive = [
      {
        name: "isActive",
        op: "like",
        value: 0,
      },
    ];
    const inActiveFitnessCount = await this.fitnessService.list(
      0,
      0,
      search,
      whereConditionsInActive,
      0,
      relation,
      1
    );
    fitness.totalFitness = allFitnessCount;
    fitness.activeFitness = activeFitnessCount;
    fitness.inActiveFitness = inActiveFitnessCount;
    const successResponse: any = {
      status: 1,
      message: "Successfully got the Fitness Count",
      data: fitness,
    };
    return response.status(200).send(successResponse);
  }
}
