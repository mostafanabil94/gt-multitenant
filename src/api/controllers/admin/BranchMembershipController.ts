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
import { CreateBranchMembershipRequest } from "./requests/CreateBranchMembershipRequest";
import { BranchMembership } from "../../models/BranchMembership";
import { BranchMembershipService } from "../../services/BranchMembershipService";
import { MembershipService } from "../../services/MembershipService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-membership")
export class BranchMembershipController {
  constructor(
    private branchMembershipService: BranchMembershipService,
    private membershipService: MembershipService,
    private branchService: BranchService
  ) {}

  // Create Branch Membership API
  /**
   * @api {post} /api/branch-membership/create-branch-membership Create Branch Membership API
   * @apiGroup Branch Membership
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "membershipId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Membership is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-membership/create-branch-membership
   * @apiErrorExample {json} createBranchMembership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-membership")
  @Authorized()
  public async createBranchMembership(
    @Body({ validate: true }) createBranchMembershipParam: CreateBranchMembershipRequest,
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
    const newBranchMembership: any = new BranchMembership();
    newBranchMembership.branchId = createBranchMembershipParam.branchId;
    newBranchMembership.membershipId = createBranchMembershipParam.membershipId;
    newBranchMembership.isActive = createBranchMembershipParam.status;
    const branchMembershipSave = await this.branchMembershipService.create(newBranchMembership);
    if (branchMembershipSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Membership saved successfully",
        data: branchMembershipSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Membership",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Membership API
  /**
   * @api {put} /api/branch-membership/update-branch-membership/:id Update Branch Membership API
   * @apiGroup Branch Membership
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "membershipId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Membership is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-membership/update-branch-membership/:id
   * @apiErrorExample {json} updateBranchMembership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-membership/:id")
  @Authorized()
  public async updateBranchMembership(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchMembershipParam: CreateBranchMembershipRequest,
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
    const branchMembership = await this.branchMembershipService.findOne({
      where: {
        branchMembershipId: id,
      },
    });
    console.log(branchMembership);
    if (!branchMembership) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchMembershipId",
      };
      return response.status(400).send(errorResponse);
    }
    branchMembership.branchId = createBranchMembershipParam.branchId;
    branchMembership.membershipId = createBranchMembershipParam.membershipId;
    branchMembership.isActive = createBranchMembershipParam.status;
    const branchMembershipUpdate = await this.branchMembershipService.update(
      id,
      branchMembership
    );
    if (branchMembershipUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Membership updated successfully",
        data: branchMembershipUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Membership",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Membership List API
  /**
   * @api {get} /api/branch-membership/branch-membership-list Branch Membership List API
   * @apiGroup Branch Membership
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Membership list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-membership/branch-membership-list
   * @apiErrorExample {json} branch Membership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-membership-list")
  @Authorized()
  public async branchMembershipList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("membershipId") membershipId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "membershipId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "membershipId",
        op: "where",
        value: membershipId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchMembershipList = await this.branchMembershipService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bMembership = val.map(async (value: any) => {
          const temp: any = value;
          const membership = await this.membershipService.findOne({
            where: { membershipId: temp.membershipId },
          });
          temp.membershipName = membership.name;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bMembership);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchMembership List",
      data: branchMembershipList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Membership API
  /**
   * @api {delete} /api/branch-membership/delete-branch-membership/:id Delete Branch Membership API
   * @apiGroup Branch Membership
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch membership.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-membership/delete-branch-membership/:id
   * @apiErrorExample {json} Branch Membership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-membership/:id")
  @Authorized()
  public async deleteBranchMembership(
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
    const branchMembershipId = await this.branchMembershipService.findOne({
      where: {
        branchMembershipId: id,
      },
    });
    if (!branchMembershipId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchMembershipId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchMembership = await this.branchMembershipService.delete(id);
    console.log("branchMembership" + branchMembership);
    if (branchMembership) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch membership",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch membership",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
