import "reflect-metadata";
import {
  Post,
  Body,
  JsonController,
  Res,
  Authorized,
  Req,
  Get,
  // QueryParam,
} from "routing-controllers";
import { classToPlain } from "class-transformer";
import jwt from "jsonwebtoken";
import { MAILService } from "../../../auth/mail.services";
import { SalesRegisterRequest } from "./requests/SalesRegisterRequest";
import { SalesLogin } from "./requests/SalesLoginRequest";
import { SalesOauthLogin } from "./requests/SalesOauthLoginRequest";
import { ChangePassword } from "./requests/changePasswordRequest";
import { Sales } from "../../models/Sales";
import { SalesService } from "../../services/SalesService";
import { SalesEditProfileRequest } from "./requests/SalesEditProfileRequest";
import { env } from "../../../env";
import { EmailTemplateService } from "../../services/EmailTemplateService";
import { ImageService } from "../../services/ImageService";
import { S3Service } from "../../services/S3Service";
import { PluginService } from "../../services/PluginService";

@JsonController("/sales")
export class SalesController {
  constructor(
    private salesService: SalesService,
    private s3Service: S3Service,
    private imageService: ImageService,
    private emailTemplateService: EmailTemplateService,
    private pluginService: PluginService
  ) {}

  // Sales Register API
  /**
   * @api {post} /api/sales/register register API
   * @apiGroup Sales User
   * @apiParam (Request body) {String} username username
   * @apiParam (Request body) {String} firstName firstName
   * @apiParam (Request body) {String} lastName lastName
   * @apiParam (Request body) {String} password password
   * @apiParam (Request body) {String} confirmPassword confirmPassword
   * @apiParam (Request body) {String} email email
   * @apiParam (Request body) {String} mobileNumber mobileNumber (Optional)
   * @apiParamExample {json} Input
   * {
   *      "username" : "",
   *      "firstName" : "",
   *      "lastName" : "",
   *      "password" : "",
   *      "confirmPassword" : "",
   *      "email" : "",
   *      "mobileNumber" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Thank you for registering with us and please check your email",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/sales/register
   * @apiErrorExample {json} Register error
   * HTTP/1.1 500 Internal Server Error
   */
  // Sales Register Function
  @Post("/register")
  public async register(
    @Body({ validate: true }) registerParam: SalesRegisterRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const newUser = new Sales();
    newUser.firstName = registerParam.firstName;
    newUser.lastName = registerParam.lastName;
    newUser.password = await Sales.hashPassword(registerParam.password);
    newUser.email = registerParam.email;
    newUser.username = registerParam.username;
    newUser.mobileNumber = registerParam.mobileNumber;
    newUser.isActive = 1;
    newUser.ip = (
      request.headers["x-forwarded-for"] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress
    ).split(",")[0];
    const resultUser = await this.salesService.findOne({
      where: { email: registerParam.email, deleteFlag: 0 },
    });
    if (resultUser) {
      const successResponse: any = {
        status: 1,
        message: "You already registered please login.",
      };
      return response.status(400).send(successResponse);
    }
    if (registerParam.password === registerParam.confirmPassword) {
      const resultData = await this.salesService.create(newUser);
      const emailContent = await this.emailTemplateService.findOne(1);
      const message = emailContent.content.replace(
        "{name}",
        resultData.firstName + " " + resultData.lastName
      );
      const redirectUrl = "google.com";
      // const redirectUrl = env.storeRedirectUrl;
      const sendMailRes = MAILService.registerMail(
        message,
        resultData.email,
        emailContent.subject,
        redirectUrl
      );
      if (sendMailRes) {
        const successResponse: any = {
          status: 1,
          message:
            "Thank you for registering with us. Kindly check your email inbox for further details. ",
          data: classToPlain(resultData),
        };
        return response.status(200).send(successResponse);
      } else {
        const errorResponse: any = {
          status: 0,
          message: "Registration successful, but unable to send email. ",
        };
        return response.status(400).send(errorResponse);
      }
    }
    const errorPasswordResponse: any = {
      status: 0,
      message: "A mismatch between password and confirm password. ",
    };
    return response.status(400).send(errorPasswordResponse);
  }

  // Forgot Password API
  /**
   * @api {post} /api/sales/forgot-password Forgot Password API
   * @apiGroup Sales User
   * @apiParam (Request body) {String} email email
   * @apiParamExample {json} Input
   * {
   *      "email" : ""
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Thank you,Your password send to your mail id please check your email.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/sales/forgot-password
   * @apiErrorExample {json} Forgot Password error
   * HTTP/1.1 500 Internal Server Error
   */
  // Forgot Password Function
  @Post("/forgot-password")
  public async forgotPassword(
    @Body({ validate: true }) forgotparam: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.salesService.findOne({
      where: { email: forgotparam.email, deleteFlag: 0 },
    });
    if (!resultData) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid Email Id",
      };
      return response.status(400).send(errorResponse);
    }
    const tempPassword: any = Math.random().toString().substr(2, 5);
    resultData.password = await Sales.hashPassword(tempPassword);
    const updateUserData = await this.salesService.update(
      resultData.id,
      resultData
    );
    const emailContent = await this.emailTemplateService.findOne(2);
    const message = emailContent.content
      .replace("{name}", updateUserData.username)
      .replace("{xxxxxx}", tempPassword);
    emailContent.content = message;
    const redirectUrl = "google.com";
    // const redirectUrl = env.storeRedirectUrl;
    const sendMailRes = MAILService.passwordForgotMail(
      message,
      updateUserData.email,
      emailContent.subject,
      redirectUrl
    );
    if (sendMailRes) {
      const successResponse: any = {
        status: 1,
        message: "Your password has been sent to your email inbox.",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "Error in sending email, Invalid email.",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Login API
  /**
   * @api {post} /api/sales/login login API
   * @apiGroup Sales User
   * @apiParam (Request body) {String} email email
   * @apiParam (Request body) {String} password password
   * @apiParam (Request body) {String} type type
   * @apiParamExample {json} Input
   * {
   *      "email" : "",
   *      "password" : "",
   *      "type" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "data": "{
   *         "token":''
   *      }",
   *      "message": "Successfully login",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/sales/login
   * @apiErrorExample {json} Login error
   * HTTP/1.1 500 Internal Server Error
   */
  // Login Function
  @Post("/login")
  public async login(
    @Body({ validate: true }) loginParam: SalesLogin,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    // select:['id','firstName','email','mobileNumber','avatar', 'avatarPath'],
    if (loginParam.type === "normal") {
      const resultData = await this.salesService.findOne({
        select: [
          "id",
          "firstName",
          "email",
          "mobileNumber",
          "password",
          "avatar",
          "avatarPath",
          "isActive",
        ],
        where: { email: loginParam.email, deleteFlag: 0 },
      });
      if (!resultData) {
        const errorUserNameResponse: any = {
          status: 0,
          message: "Invalid EmailId",
        };
        return response.status(400).send(errorUserNameResponse);
      }
      if (resultData.isActive === 0) {
        const errorUserInActiveResponse: any = {
          status: 0,
          message: "InActive Sales.",
        };
        return response.status(400).send(errorUserInActiveResponse);
      }
      if (await Sales.comparePassword(resultData, loginParam.password)) {
        // create a token
        const token = jwt.sign({ id: resultData.id }, "123##$$)(***&");

        // const customerActivity = new CustomerActivity();
        // customerActivity.customerId = resultData.id;
        // customerActivity.activityId = 1;
        // customerActivity.description = "loggedIn";
        // await this.customerActivityService.create(customerActivity);

        // const loginLog = new LoginLog();
        // loginLog.customerId = resultData.id;
        // loginLog.emailId = resultData.email;
        // loginLog.firstName = resultData.firstName;
        // loginLog.ipAddress = (
        //   request.headers["x-forwarded-for"] ||
        //   request.connection.remoteAddress ||
        //   request.socket.remoteAddress ||
        //   request.connection.socket.remoteAddress
        // ).split(",")[0];
        // const savedloginLog = await this.loginLogService.create(loginLog);
        const customer = await this.salesService.findOne({
          where: { email: loginParam.email, deleteFlag: 0 },
        });
        // customer.lastLogin = savedloginLog.createdDate;
        await this.salesService.create(customer);
        console.log(loginParam.type);
        const successResponse: any = {
          status: 1,
          message: "Loggedin successfully",
          data: {
            token,
            user: classToPlain(resultData),
          },
        };
        return response.status(200).send(successResponse);
      }
      const errorResponse: any = {
        status: 0,
        message: "Invalid password",
      };
      return response.status(400).send(errorResponse);
    }
    if (loginParam.type === "gmail") {
      const plugin = await this.pluginService.findOne({
        where: { pluginName: loginParam.type, pluginStatus: 1 },
      });
      if (plugin) {
        const pluginInfo = JSON.parse(plugin.pluginAdditionalInfo);
        console.log(request.headers);
        const route = env.baseUrl + pluginInfo.defaultRoute;
        const successResponse: any = {
          status: 1,
          message: "Redirect to this url.",
          data: { returnPath: route, clientId: pluginInfo.clientId },
        };
        return response.status(200).send(successResponse);
      } else {
        const successResponse: any = {
          status: 0,
          message: "You are not install this plugin or problem in installation",
        };
        return response.status(400).send(successResponse);
      }
    } else if (loginParam.type === "facebook") {
      const plugin = await this.pluginService.findOne({
        where: { pluginName: loginParam.type, pluginStatus: 1 },
      });
      if (plugin) {
        const pluginInfo = JSON.parse(plugin.pluginAdditionalInfo);
        console.log(request.headers);
        const route = env.baseUrl + pluginInfo.defaultRoute;
        const successResponse: any = {
          status: 1,
          message: "Redirect to this url.",
          data: {
            returnPath: route,
            AppId: pluginInfo.AppId,
            AppSecretKey: pluginInfo.AppSecretKey,
          },
        };
        return response.status(200).send(successResponse);
      } else {
        const successResponse: any = {
          status: 0,
          message: "You are not install this plugin or problem in installation",
        };
        return response.status(400).send(successResponse);
      }
    }
  }
  // Change Password API
  /**
   * @api {post} /api/sales/change-password Change Password API
   * @apiGroup Sales User
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} oldPassword Old Password
   * @apiParam (Request body) {String} newPassword New Password
   * @apiParamExample {json} Input
   *      "oldPassword" : "",
   *      "newPassword" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Your password changed successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/sales/change-password
   * @apiErrorExample {json} Change Password error
   * HTTP/1.1 500 Internal Server Error
   */
  // Change Password Function
  @Post("/change-password")
  @Authorized("sales")
  public async changePassword(
    @Body({ validate: true }) changePasswordParam: ChangePassword,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.salesService.findOne({
      where: { id: request.user.id },
    });
    if (
      await Sales.comparePassword(
        resultData,
        changePasswordParam.oldPassword
      )
    ) {
      const val = await Sales.comparePassword(
        resultData,
        changePasswordParam.newPassword
      );
      if (val) {
        const errResponse: any = {
          status: 0,
          message: "you are given a same password, please try different one",
        };
        return response.status(400).send(errResponse);
      }
      resultData.password = await Sales.hashPassword(
        changePasswordParam.newPassword
      );
      const updateUserData = await this.salesService.update(
        resultData.id,
        resultData
      );
      if (updateUserData) {
        const successResponse: any = {
          status: 1,
          message: "Your password changed successfully",
        };
        return response.status(200).send(successResponse);
      }
    }
    const errorResponse: any = {
      status: 0,
      message: "Your old password is wrong",
    };
    return response.status(400).send(errorResponse);
  }

  // Get Customer Profile API
  /**
   * @api {get} /api/sales/get-profile Get Profile API
   * @apiGroup Sales User
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully Get the Profile..!",
   *      "status": "1"
   *       "data":{}
   * }
   * @apiSampleRequest /api/sales/get-profile
   * @apiErrorExample {json} Get Profile error
   * HTTP/1.1 500 Internal Server Error
   */
  // Get Profile Function
  @Get("/get-profile")
  @Authorized("sales")
  public async getProfile(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.salesService.findOne({
      where: { id: request.user.id },
    });
    const successResponse: any = {
      status: 1,
      message: "Successfully Get the Profile.",
      data: resultData,
    };
    return response.status(200).send(successResponse);
  }

  // Customer Edit Profile API
  /**
   * @api {post} /api/sales/edit-profile Edit Profile API
   * @apiGroup Sales User
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} firstName First Name
   * @apiParam (Request body) {String} middleName Middle Name
   * @apiParam (Request body) {String} lastName Last Name
   * @apiParam (Request body) {String} password password
   * @apiParam (Request body) {String} email User Email
   * @apiParam (Request body) {Number} mobileNumber User Phone Number (Optional)
   * @apiParam (Request body) {String} image Customer Image
   * @apiParamExample {json} Input
   * {
   *      "firstName" : "",
   *      "lastName" : "",
   *      "password": "",
   *      "email" : "",
   *      "mobileNumber" : "",
   *      "image": "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully updated your profile.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/sales/edit-profile
   * @apiErrorExample {json} Register error
   * HTTP/1.1 500 Internal Server Error
   */
  // Customer Profile Edit Function
  @Post("/edit-profile")
  @Authorized("sales")
  public async editProfile(
    @Body({ validate: true })
    customerEditProfileRequest: SalesEditProfileRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const image = customerEditProfileRequest.image;
    let name;

    const resultData = await this.salesService.findOne({
      select: [
        "id",
        "firstName",
        "middleName",
        "lastName",
        "fullName",
        "email",
        "mobileNumber",
        "address",
        "countryId",
        "cityId",
        "avatar",
        "avatarPath",
        "password",
        "gender",
        "dob",
        "type",
        "source",
        "membershipCode",
        "mailStatus",
      ],
      where: { id: request.user.id },
    });
    if (image) {
      const base64Data = new Buffer(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const type = image.split(";")[0].split("/")[1];
      name = "Img_" + Date.now() + "." + type; // path.extname(file.originalname);
      const path = "customer/";
      let val: any;
      if (env.imageserver === "s3") {
        val = await this.s3Service.imageUpload(path + name, base64Data, type);
      } else {
        val = await this.imageService.imageUpload(path + name, base64Data);
      }
      console.log(val);
      resultData.avatar = name;
      resultData.avatarPath = path;
    }
    resultData.firstName = customerEditProfileRequest.firstName;
    resultData.lastName = customerEditProfileRequest.lastName;
    resultData.email = customerEditProfileRequest.email;
    resultData.mobileNumber = customerEditProfileRequest.mobileNumber;
    resultData.mailStatus = customerEditProfileRequest.mailStatus;
    resultData.address = customerEditProfileRequest.address;
    resultData.countryId = customerEditProfileRequest.countryId;
    resultData.cityId = customerEditProfileRequest.cityId;
    resultData.username = customerEditProfileRequest.username;
    if (customerEditProfileRequest.password) {
      // if (await Customer.comparePassword(resultData, customerEditProfileRequest.oldPassword)) {
      resultData.password = await Sales.hashPassword(
        customerEditProfileRequest.password
      );
      const updateUserData = await this.salesService.update(
        resultData.id,
        resultData
      );
      if (updateUserData) {
        const successResponseResult: any = {
          status: 1,
          message: "Your profile Update Successfully.",
          data: classToPlain(updateUserData),
        };
        return response.status(200).send(successResponseResult);
      }
    }
    const updateuserData = await this.salesService.update(
      resultData.id,
      resultData
    );
    const successResponse: any = {
      status: 1,
      message: "Your profile Update Successfully.",
      data: classToPlain(updateuserData),
    };
    return response.status(200).send(successResponse);
  }

  // logList API
  /**
   * @api {get} /api/sales/login-log-list Login Log list API
   * @apiGroup Sales User
   * @apiParam (Request body) {Number} limit limit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get login log list",
   *      "data":{
   *      "id"
   *      "customerId"
   *      "emailId"
   *      "firstName"
   *      "ipAddress"
   *      "createdDate"
   *      }
   * }
   * @apiSampleRequest /api/sales/login-log-list
   * @apiErrorExample {json} Front error
   * HTTP/1.1 500 Internal Server Error
   */
  // @Get("/login-log-list")
  // public async LogList(
  //   @QueryParam("limit") limit: number,
  //   @Res() response: any
  // ): Promise<any> {
  //   const loginLogList = await this.loginLogService.logList(limit);
  //   const promise = loginLogList.map(async (result: any) => {
  //     const moment = require("moment");
  //     const createdDate = moment
  //       .utc(result.createdDate)
  //       .local()
  //       .format("YYYY-MM-DD");
  //     const temp: any = result;
  //     temp.createdDate = createdDate;
  //     return temp;
  //   });
  //   const finalResult = await Promise.all(promise);
  //   const successResponse: any = {
  //     status: 1,
  //     message: "Successfully get login Log list",
  //     data: finalResult,
  //   };
  //   return response.status(200).send(successResponse);
  // }

  // Oauth Login API
  /**
   * @api {post} /api/sales/Oauth-login Oauth login API
   * @apiGroup Sales User
   * @apiParam (Request body) {String} emailId User Email Id
   * @apiParam (Request body) {String} source source
   * @apiParam (Request body) {String} oauthData oauthData
   * @apiParamExample {json} Input
   * {
   *      "emailId" : "",
   *      "source" : "",
   *      "oauthData" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "data": "{
   *         "token":''
   *         "password":''
   *      }",
   *      "message": "Successfully login",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/sales/Oauth-login
   * @apiErrorExample {json} Login error
   * HTTP/1.1 500 Internal Server Error
   */
  // Login Function
  @Post("/Oauth-login")
  public async OauthLogin(
    @Body({ validate: true }) loginParam: SalesOauthLogin,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    console.log(loginParam.emailId);
    const resultData = await this.salesService.findOne({
      where: { email: loginParam.emailId },
    });
    if (!resultData) {
      const newUser = new Sales();
      const tempPassword: any = Math.random().toString().substr(2, 5);
      newUser.password = await Sales.hashPassword(tempPassword);
      newUser.email = loginParam.emailId;
      newUser.username = loginParam.emailId;
      newUser.isActive = 1;
      newUser.ip = (
        request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress
      ).split(",")[0];
      const newCustomer = await this.salesService.create(newUser);
      // create a token
      const token = jwt.sign({ id: newCustomer.id }, "123##$$)(***&", {
        expiresIn: 86400, // expires in 24 hours
      });
      const emailContent = await this.emailTemplateService.findOne(1);
      const message = emailContent.content.replace(
        "{name}",
        newCustomer.username
      );
      const redirectUrl = "google.com";
      // const redirectUrl = env.storeRedirectUrl;
      const sendMailRes = MAILService.registerMail(
        message,
        newCustomer.email,
        emailContent.subject,
        redirectUrl
      );
      if (sendMailRes) {
        const successResponse: any = {
          status: 1,
          message: "Loggedin successfully. ",
          data: {
            token,
            user: classToPlain(resultData),
            password: tempPassword,
          },
        };
        return response.status(200).send(successResponse);
      }
    } else {
      // create a token
      const token = jwt.sign({ id: resultData.id }, "123##$$)(***&", {
        expiresIn: 86400, // expires in 24 hours
      });

      const successResponse: any = {
        status: 1,
        message: "Loggedin successfully.",
        data: {
          token,
          user: classToPlain(resultData),
        },
      };
      return response.status(200).send(successResponse);
    }
  }
}
