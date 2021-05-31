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
import { CreateBranchAdminRequest } from "./requests/CreateBranchAdminRequest";
import { BranchAdmin } from "../../models/BranchAdmin";
import { BranchAdminService } from "../../services/BranchAdminService";
import { UserService } from "../../services/UserService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-admin")
export class BranchAdminController {
  constructor(
    private branchAdminService: BranchAdminService,
    private userService: UserService,
    private branchService: BranchService
  ) {}

  // Create Branch Admin API
  /**
   * @api {post} /api/branch-admin/create-branch-admin Create Branch Admin API
   * @apiGroup Branch Admin
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
   *      "message": "New Branch Admin is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-admin/create-branch-admin
   * @apiErrorExample {json} createBranchAdmin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-admin")
  @Authorized()
  public async createBranchAdmin(
    @Body({ validate: true }) createBranchAdminParam: CreateBranchAdminRequest,
    @Res() response: any
  ): Promise<any> {
    const newBranchAdmin: any = new BranchAdmin();
    newBranchAdmin.branchId = createBranchAdminParam.branchId;
    newBranchAdmin.userId = createBranchAdminParam.userId;
    newBranchAdmin.isActive = createBranchAdminParam.status;
    const branchAdminSave = await this.branchAdminService.create(
      newBranchAdmin
    );
    if (branchAdminSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Admin saved successfully",
        data: branchAdminSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Admin",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Admin API
  /**
   * @api {put} /api/branch-admin/update-branch-admin/:id Update Branch Admin API
   * @apiGroup Branch Admin
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
   *      "message": "Branch Admin is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-admin/update-branch-admin/:id
   * @apiErrorExample {json} updateBranchAdmin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-admin/:id")
  @Authorized()
  public async updateBranchAdmin(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchAdminParam: CreateBranchAdminRequest,
    @Res() response: any
  ): Promise<any> {
    const branchAdmin = await this.branchAdminService.findOne({
      where: {
        branchAdminId: id,
      },
    });
    console.log(branchAdmin);
    if (!branchAdmin) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchAdminId",
      };
      return response.status(400).send(errorResponse);
    }
    branchAdmin.branchId = createBranchAdminParam.branchId;
    branchAdmin.userId = createBranchAdminParam.userId;
    branchAdmin.isActive = createBranchAdminParam.status;
    const branchAdminUpdate = await this.branchAdminService.update(
      id,
      branchAdmin
    );
    if (branchAdminUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Admin updated successfully",
        data: branchAdminUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Admin",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Admin List API
  /**
   * @api {get} /api/branch-admin/branch-admin-list Branch Admin List API
   * @apiGroup Branch Admin
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
   *    "message": "Successfully get Branch Admin list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-admin/branch-admin-list
   * @apiErrorExample {json} branch Admin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-admin-list")
  @Authorized()
  public async branchAdminList(
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

    const branchAdminList = await this.branchAdminService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bAdmin = val.map(async (value: any) => {
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
        const results = Promise.all(bAdmin);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchAdmin List",
      data: branchAdminList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Admin API
  /**
   * @api {delete} /api/branch-admin/delete-branch-admin/:id Delete Branch Admin API
   * @apiGroup Branch Admin
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch admin.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-admin/delete-branch-admin/:id
   * @apiErrorExample {json} Branch Admin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-admin/:id")
  @Authorized()
  public async deleteRole(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const branchAdminId = await this.branchAdminService.findOne({
      where: {
        branchAdminId: id,
      },
    });
    if (!branchAdminId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchAdminId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchAdmin = await this.branchAdminService.delete(id);
    console.log("branchAdmin" + branchAdmin);
    if (branchAdmin) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch admin",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch admin",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
