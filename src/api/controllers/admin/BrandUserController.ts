import "reflect-metadata";
import {
  Post,
  Body,
  JsonController,
  Res,
  Authorized,
  Put,
  Param,
  QueryParam,
  Get,
  Delete,
  Req,
} from "routing-controllers";
import { CreateBrandUserRequest } from "./requests/CreateBrandUserRequest";
import { BrandUser } from "../../models/BrandUser";
import { BrandUserService } from "../../services/BrandUserService";
import { UserService } from "../../services/UserService";
import { BrandService } from "../../services/BrandService";

@JsonController("/brand-user")
export class BrandUserController {
  constructor(
    private brandUserService: BrandUserService,
    private userService: UserService,
    private brandService: BrandService
  ) {}

  // Create Brand User API
  /**
   * @api {post} /api/brand-user/create-brand-user Create Brand User API
   * @apiGroup Brand User
   * @apiParam (Request body) {Number} brandId brandId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "brandId" : "",
   *      "userId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Brand User is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-user/create-brand-user
   * @apiErrorExample {json} createBrandUser error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-brand-user")
  @Authorized()
  public async createBrandUser(
    @Body({ validate: true }) createBrandUserParam: CreateBrandUserRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin and Admin has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const newBrandUser: any = new BrandUser();
    newBrandUser.brandId = createBrandUserParam.brandId;
    newBrandUser.userId = createBrandUserParam.userId;
    newBrandUser.isActive = createBrandUserParam.status;
    const brandUserSave = await this.brandUserService.create(newBrandUser);
    if (brandUserSave) {
      const successResponse: any = {
        status: 1,
        message: "Brand User saved successfully",
        data: brandUserSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Brand User",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Brand User API
  /**
   * @api {put} /api/brand-user/update-brand-user/:id Update Brand User API
   * @apiGroup Brand User
   * @apiParam (Request body) {Number} brandId brandId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "brandId" : "",
   *      "userId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Brand User is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-user/update-brand-user/:id
   * @apiErrorExample {json} updateBrandUser error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-brand-user/:id")
  @Authorized()
  public async updateBrandUser(
    @Param("id") id: number,
    @Body({ validate: true }) createBrandUserParam: CreateBrandUserRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin and Admin has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const brandUser = await this.brandUserService.findOne({
      where: {
        brandUserId: id,
      },
    });
    console.log(brandUser);
    if (!brandUser) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandUserId",
      };
      return response.status(400).send(errorResponse);
    }
    brandUser.brandId = createBrandUserParam.brandId;
    brandUser.userId = createBrandUserParam.userId;
    brandUser.isActive = createBrandUserParam.status;
    const brandUserUpdate = await this.brandUserService.update(
      id,
      brandUser
    );
    if (brandUserUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Brand User updated successfully",
        data: brandUserUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Brand User",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Brand User List API
  /**
   * @api {get} /api/brand-user/brand-user-list Brand User List API
   * @apiGroup Brand User
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} brandId brandId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Brand User list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/brand-user/brand-user-list
   * @apiErrorExample {json} brand User error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/brand-user-list")
  @Authorized()
  public async brandUserList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("brandId") brandId: number,
    @QueryParam("userId") userId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["brandId", "userId", "isActive"];
    const whereConditions = [
      {
        name: "brandId",
        op: "where",
        value: brandId,
      },
      {
        name: "userId",
        op: "where",
        value: userId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const brandUserList = await this.brandUserService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bUser = val.map(async (value: any) => {
          const temp: any = value;
          const user = await this.userService.findOne({
            where: { userId: temp.userId },
          });
          temp.username = user.username;
          temp.email = user.email;
          const brand = await this.brandService.findOne({
            where: { brandId: temp.brandId },
          });
          temp.brandName = brand.name;
          return temp;
        });
        const results = Promise.all(bUser);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all brandUser List",
      data: brandUserList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Brand User API
  /**
   * @api {delete} /api/brand-user/delete-brand-user/:id Delete Brand User API
   * @apiGroup Brand User
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted brand user.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-user/delete-brand-user/:id
   * @apiErrorExample {json} Brand User error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-brand-user/:id")
  @Authorized()
  public async deleteRole(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin and Admin has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
    const brandUserId = await this.brandUserService.findOne({
      where: {
        brandUserId: id,
      },
    });
    if (!brandUserId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandUserId",
      };
      return response.status(400).send(errorResponse);
    }

    const brandUser = await this.brandUserService.delete(id);
    console.log("brandUser" + brandUser);
    if (brandUser) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted brand user",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete brand user",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
