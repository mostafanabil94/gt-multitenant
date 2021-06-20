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
import { CreateBranchUserRequest } from "./requests/CreateBranchUserRequest";
import { BranchUser } from "../../models/BranchUser";
import { BranchUserService } from "../../services/BranchUserService";
import { UserService } from "../../services/UserService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-user")
export class BranchUserController {
  constructor(
    private branchUserService: BranchUserService,
    private userService: UserService,
    private branchService: BranchService
  ) {}

  // Create Branch User API
  /**
   * @api {post} /api/branch-user/create-branch-user Create Branch User API
   * @apiGroup Branch User
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "userId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch User is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-user/create-branch-user
   * @apiErrorExample {json} createBranchUser error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-user")
  @Authorized()
  public async createBranchUser(
    @Body({ validate: true }) createBranchUserParam: CreateBranchUserRequest,
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
    const newBranchUser: any = new BranchUser();
    newBranchUser.branchId = createBranchUserParam.branchId;
    newBranchUser.userId = createBranchUserParam.userId;
    newBranchUser.isActive = createBranchUserParam.status;
    const branchUserSave = await this.branchUserService.create(
      newBranchUser
    );
    if (branchUserSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch User saved successfully",
        data: branchUserSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch User",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch User API
  /**
   * @api {put} /api/branch-user/update-branch-user/:id Update Branch User API
   * @apiGroup Branch User
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "userId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch User is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-user/update-branch-user/:id
   * @apiErrorExample {json} updateBranchUser error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-user/:id")
  @Authorized()
  public async updateBranchUser(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchUserParam: CreateBranchUserRequest,
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
    const branchUser = await this.branchUserService.findOne({
      where: {
        branchUserId: id,
      },
    });
    console.log(branchUser);
    if (!branchUser) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchUserId",
      };
      return response.status(400).send(errorResponse);
    }
    branchUser.branchId = createBranchUserParam.branchId;
    branchUser.userId = createBranchUserParam.userId;
    branchUser.isActive = createBranchUserParam.status;
    const branchUserUpdate = await this.branchUserService.update(
      id,
      branchUser
    );
    if (branchUserUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch User updated successfully",
        data: branchUserUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch User",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch User List API
  /**
   * @api {get} /api/branch-user/branch-user-list Branch User List API
   * @apiGroup Branch User
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch User list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-user/branch-user-list
   * @apiErrorExample {json} branch User error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-user-list")
  @Authorized()
  public async branchUserList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("userId") userId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "userId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
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

    const branchUserList = await this.branchUserService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bUser = val.map(async (value: any) => {
          const temp: any = value;
          const user = await this.userService.findOne({
            where: { userId: temp.userId },
          });
          temp.username = user.username;
          temp.email = user.email;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bUser);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchUser List",
      data: branchUserList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch User API
  /**
   * @api {delete} /api/branch-user/delete-branch-user/:id Delete Branch User API
   * @apiGroup Branch User
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch user.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-user/delete-branch-user/:id
   * @apiErrorExample {json} Branch User error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-user/:id")
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
    const branchUserId = await this.branchUserService.findOne({
      where: {
        branchUserId: id,
      },
    });
    if (!branchUserId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchUserId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchUser = await this.branchUserService.delete(id);
    console.log("branchUser" + branchUser);
    if (branchUser) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch user",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch user",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
