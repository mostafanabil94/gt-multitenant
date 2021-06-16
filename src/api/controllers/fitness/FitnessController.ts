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
import { FitnessRegisterRequest } from "./requests/FitnessRegisterRequest";
import { FitnessLogin } from "./requests/FitnessLoginRequest";
import { FitnessOauthLogin } from "./requests/FitnessOauthLoginRequest";
import { ChangePassword } from "./requests/changePasswordRequest";
import { Fitness } from "../../models/Fitness";
import { FitnessService } from "../../services/FitnessService";
import { FitnessEditProfileRequest } from "./requests/FitnessEditProfileRequest";
import { env } from "../../../env";
import { EmailTemplateService } from "../../services/EmailTemplateService";
import { ImageService } from "../../services/ImageService";
import { S3Service } from "../../services/S3Service";
import { PluginService } from "../../services/PluginService";

@JsonController("/fitness")
export class FitnessController {
  constructor(
    private fitnessService: FitnessService,
    private s3Service: S3Service,
    private imageService: ImageService,
    private emailTemplateService: EmailTemplateService,
    private pluginService: PluginService
  ) {}

  // Fitness Register API
  /**
   * @api {post} /api/fitness/register register API
   * @apiGroup Fitness User
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
   * @apiSampleRequest /api/fitness/register
   * @apiErrorExample {json} Register error
   * HTTP/1.1 500 Internal Server Error
   */
  // Fitness Register Function
  @Post("/register")
  public async register(
    @Body({ validate: true }) registerParam: FitnessRegisterRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const newUser = new Fitness();
    newUser.firstName = registerParam.firstName;
    newUser.lastName = registerParam.lastName;
    newUser.password = await Fitness.hashPassword(registerParam.password);
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
    const resultUser = await this.fitnessService.findOne({
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
      const resultData = await this.fitnessService.create(newUser);
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
   * @api {post} /api/fitness/forgot-password Forgot Password API
   * @apiGroup Fitness User
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
   * @apiSampleRequest /api/fitness/forgot-password
   * @apiErrorExample {json} Forgot Password error
   * HTTP/1.1 500 Internal Server Error
   */
  // Forgot Password Function
  @Post("/forgot-password")
  public async forgotPassword(
    @Body({ validate: true }) forgotparam: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.fitnessService.findOne({
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
    resultData.password = await Fitness.hashPassword(tempPassword);
    const updateUserData = await this.fitnessService.update(
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
   * @api {post} /api/fitness/login login API
   * @apiGroup Fitness User
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
   * @apiSampleRequest /api/fitness/login
   * @apiErrorExample {json} Login error
   * HTTP/1.1 500 Internal Server Error
   */
  // Login Function
  @Post("/login")
  public async login(
    @Body({ validate: true }) loginParam: FitnessLogin,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    // select:['id','firstName','email','mobileNumber','avatar', 'avatarPath'],
    if (loginParam.type === "normal") {
      const resultData = await this.fitnessService.findOne({
        select: [
          "fitnessId",
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
          message: "InActive Fitness.",
        };
        return response.status(400).send(errorUserInActiveResponse);
      }
      if (await Fitness.comparePassword(resultData, loginParam.password)) {
        // create a token
        const token = jwt.sign({ id: resultData.fitnessId }, "123##$$)(***&");

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
        const fitness = await this.fitnessService.findOne({
          where: { email: loginParam.email, deleteFlag: 0 },
        });
        // fitness.lastLogin = savedloginLog.createdDate;
        await this.fitnessService.create(fitness);
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
   * @api {post} /api/fitness/change-password Change Password API
   * @apiGroup Fitness User
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
   * @apiSampleRequest /api/fitness/change-password
   * @apiErrorExample {json} Change Password error
   * HTTP/1.1 500 Internal Server Error
   */
  // Change Password Function
  @Post("/change-password")
  @Authorized("fitness")
  public async changePassword(
    @Body({ validate: true }) changePasswordParam: ChangePassword,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.fitnessService.findOne({
      where: { fitnessId: request.user.fitnessId },
    });
    if (
      await Fitness.comparePassword(
        resultData,
        changePasswordParam.oldPassword
      )
    ) {
      const val = await Fitness.comparePassword(
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
      resultData.password = await Fitness.hashPassword(
        changePasswordParam.newPassword
      );
      const updateUserData = await this.fitnessService.update(
        resultData.fitnessId,
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

  // Get Fitness Profile API
  /**
   * @api {get} /api/fitness/get-profile Get Profile API
   * @apiGroup Fitness User
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully Get the Profile..!",
   *      "status": "1"
   *       "data":{}
   * }
   * @apiSampleRequest /api/fitness/get-profile
   * @apiErrorExample {json} Get Profile error
   * HTTP/1.1 500 Internal Server Error
   */
  // Get Profile Function
  @Get("/get-profile")
  @Authorized("fitness")
  public async getProfile(
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const resultData = await this.fitnessService.findOne({
      where: { fitnessId: request.user.fitnessId },
    });
    const successResponse: any = {
      status: 1,
      message: "Successfully Get the Profile.",
      data: resultData,
    };
    return response.status(200).send(successResponse);
  }

  // Fitness Edit Profile API
  /**
   * @api {post} /api/fitness/edit-profile Edit Profile API
   * @apiGroup Fitness User
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} firstName First Name
   * @apiParam (Request body) {String} middleName Middle Name
   * @apiParam (Request body) {String} lastName Last Name
   * @apiParam (Request body) {String} password password
   * @apiParam (Request body) {String} email User Email
   * @apiParam (Request body) {Number} mobileNumber User Phone Number (Optional)
   * @apiParam (Request body) {String} image Fitness Image
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
   * @apiSampleRequest /api/fitness/edit-profile
   * @apiErrorExample {json} Register error
   * HTTP/1.1 500 Internal Server Error
   */
  // Fitness Profile Edit Function
  @Post("/edit-profile")
  @Authorized("fitness")
  public async editProfile(
    @Body({ validate: true })
    fitnessEditProfileRequest: FitnessEditProfileRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const image = fitnessEditProfileRequest.image;
    let name;

    const resultData = await this.fitnessService.findOne({
      select: [
        "fitnessId",
        "firstName",
        "lastName",
        "email",
        "mobileNumber",
        "address",
        "avatar",
        "avatarPath",
        "password",
      ],
      where: { fitnessId: request.user.fitnessId },
    });
    if (image) {
      const base64Data = new Buffer(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const type = image.split(";")[0].split("/")[1];
      name = "Img_" + Date.now() + "." + type; // path.extname(file.originalname);
      const path = "fitness/";
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
    resultData.firstName = fitnessEditProfileRequest.firstName;
    resultData.lastName = fitnessEditProfileRequest.lastName;
    resultData.email = fitnessEditProfileRequest.email;
    resultData.mobileNumber = fitnessEditProfileRequest.mobileNumber;
    resultData.mailStatus = fitnessEditProfileRequest.mailStatus;
    resultData.address = fitnessEditProfileRequest.address;
    resultData.username = fitnessEditProfileRequest.username;
    if (fitnessEditProfileRequest.password) {
      // if (await Fitness.comparePassword(resultData, fitnessEditProfileRequest.oldPassword)) {
      resultData.password = await Fitness.hashPassword(
        fitnessEditProfileRequest.password
      );
      const updateUserData = await this.fitnessService.update(
        resultData.fitnessId,
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
    const updateuserData = await this.fitnessService.update(
      resultData.fitnessId,
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
   * @api {get} /api/fitness/login-log-list Login Log list API
   * @apiGroup Fitness User
   * @apiParam (Request body) {Number} limit limit
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get login log list",
   *      "data":{
   *      "id"
   *      "fitnessId"
   *      "emailId"
   *      "firstName"
   *      "ipAddress"
   *      "createdDate"
   *      }
   * }
   * @apiSampleRequest /api/fitness/login-log-list
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
   * @api {post} /api/fitness/Oauth-login Oauth login API
   * @apiGroup Fitness User
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
   * @apiSampleRequest /api/fitness/Oauth-login
   * @apiErrorExample {json} Login error
   * HTTP/1.1 500 Internal Server Error
   */
  // Login Function
  @Post("/Oauth-login")
  public async OauthLogin(
    @Body({ validate: true }) loginParam: FitnessOauthLogin,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    console.log(loginParam.emailId);
    const resultData = await this.fitnessService.findOne({
      where: { email: loginParam.emailId },
    });
    if (!resultData) {
      const newUser = new Fitness();
      const tempPassword: any = Math.random().toString().substr(2, 5);
      newUser.password = await Fitness.hashPassword(tempPassword);
      newUser.email = loginParam.emailId;
      newUser.username = loginParam.emailId;
      newUser.isActive = 1;
      newUser.ip = (
        request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress
      ).split(",")[0];
      const newFitness = await this.fitnessService.create(newUser);
      // create a token
      const token = jwt.sign({ id: newFitness.id }, "123##$$)(***&", {
        expiresIn: 86400, // expires in 24 hours
      });
      const emailContent = await this.emailTemplateService.findOne(1);
      const message = emailContent.content.replace(
        "{name}",
        newFitness.username
      );
      const redirectUrl = "google.com";
      // const redirectUrl = env.storeRedirectUrl;
      const sendMailRes = MAILService.registerMail(
        message,
        newFitness.email,
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
