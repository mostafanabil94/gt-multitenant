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
import { CreateMembershipPlanRequest } from "./requests/CreateMembershipPlanRequest";
import { MembershipPlanService } from "../../services/MembershipPlanService";
import { MembershipPlan } from "../../models/MembershipPlan";

@JsonController("/membershipPlan")
export class MembershipPlanController {
  constructor(
    private membershipPlanService: MembershipPlanService
  ) {}

  // Create Membership Plan API
  /**
   * @api {post} /api/membership-plan/create-membershipPlan Create Membership Plan API
   * @apiGroup Membership Plan
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {String} description description
   * @apiParam (Request body) {String} isPrivate isPrivate
   * @apiParam (Request body) {String} isOnePurchase isOnePurchase
   * @apiParam (Request body) {String} isTrial isTrial
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "name" : "",
   *      "description" : "",
   *      "isPrivate" : "",
   *      "isOnePurchase" : "",
   *      "isTrial" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New MembershipPlan is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership-plan/create-membershipPlan
   * @apiErrorExample {json} createMembershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-membershipPlan")
  @Authorized()
  public async createMembershipPlan(
    @Body({ validate: true }) createMembershipPlanParam: CreateMembershipPlanRequest,
    @Res() response: any
  ): Promise<any> {
    console.log(createMembershipPlanParam);
    const membershipPlan = await this.membershipPlanService.findOne({
      where: {
        name: createMembershipPlanParam.name,
      },
    });
    console.log(membershipPlan);
    if (membershipPlan) {
      const errorResponse: any = {
        status: 0,
        message: "this membershipPlan already exist",
      };
      return response.status(400).send(errorResponse);
    }

    const newMembershipPlanParams: any = new MembershipPlan();
    newMembershipPlanParams.name = createMembershipPlanParam.name;
    newMembershipPlanParams.isActive = createMembershipPlanParam.status;
    const membershipPlanSaveResponse = await this.membershipPlanService.create(
      newMembershipPlanParams
    );
    if (membershipPlanSaveResponse) {
      const successResponse: any = {
        status: 1,
        message: "MembershipPlan saved successfully",
        data: membershipPlanSaveResponse,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save MembershipPlan",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Membership Plan API
  /**
   * @api {put} /api/membership-plan/update-membership-plan/:id Update Membership Plan API
   * @apiGroup Membership Plan
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {String} description description
   * @apiParam (Request body) {String} isPrivate isPrivate
   * @apiParam (Request body) {String} isOnePurchase isOnePurchase
   * @apiParam (Request body) {String} isTrial isTrial
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "name" : "",
   *      "description" : "",
   *      "isPrivate" : "",
   *      "isOnePurchase" : "",
   *      "isTrial" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": " MembershipPlan is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership-plan/update-membership-plan/:id
   * @apiErrorExample {json} updateMembershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-membership-plan/:id")
  @Authorized()
  public async updateMembershipPlan(
    @Param("id") id: number,
    @Body({ validate: true }) createMembershipPlanParam: CreateMembershipPlanRequest,
    @Res() response: any
  ): Promise<any> {
    console.log(createMembershipPlanParam);
    const membershipPlan = await this.membershipPlanService.findOne({
      where: {
        membershipPlanId: id,
      },
    });
    console.log(membershipPlan);
    if (!membershipPlan) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid membershipPlanId",
      };
      return response.status(400).send(errorResponse);
    }

    const newMembershipPlanParams: any = new MembershipPlan();
    newMembershipPlanParams.name = createMembershipPlanParam.name;
    newMembershipPlanParams.isActive = createMembershipPlanParam.status;
    const membershipPlanSaveResponse = await this.membershipPlanService.update(
      id,
      newMembershipPlanParams
    );
    if (membershipPlanSaveResponse) {
      const successResponse: any = {
        status: 1,
        message: "MembershipPlan updated successfully",
        data: membershipPlanSaveResponse,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update MembershipPlan",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // MembershipPlan List API
  /**
   * @api {get} /api/membership-plan/membershipPlanlist MembershipPlan List API
   * @apiGroup Membership Plan
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {String} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get membershipPlan list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/membership-plan/membershipPlanlist
   * @apiErrorExample {json} membershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/membership-plan-list")
  @Authorized()
  public async membershipPlanList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    // @QueryParam("isTrial") isTrial: number,
    // @QueryParam("isPrivate") isPrivate: number,
    // @QueryParam("isOnePurchase") isOnePurchase: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    console.log(keyword);
    const select = ["membershipPlanId", "name", "isActive"];
    const whereConditions = [
      {
        name: "name",
        op: "like",
        value: keyword,
      },
      {
        name: "isActive",
        op: "where",
        value: status,
      },
    ];

    // if (isTrial !== undefined) {
    //     whereConditions.push({
    //         name: "isTrial",
    //         op: "where",
    //         value: isTrial,
    //     })
    // }

    const search = [];

    const relations = [];

    const membershipPlanList = await this.membershipPlanService.list(
      limit,
      offset,
      select,
      search,
      whereConditions,
      relations,
      count
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully get all membershipPlan List",
      data: membershipPlanList,
    };
    return response.status(200).send(successResponse);
  }
  // delete Membership Plan API
  /**
   * @api {delete} /api/membership-plan/delete-membership-plan/:id Delete Membership Plan API
   * @apiGroup Membership Plan
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {number} membershipPlanId  membershipPlanId
   * @apiParamExample {json} Input
   * {
   *      "membershipPlanId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted MembershipPlan.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership-plan/delete-membership-plan/:id
   * @apiErrorExample {json} MembershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-membership-plan/:id")
  @Authorized()
  public async deleteMembershipPlan(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const membershipPlanId = await this.membershipPlanService.findOne({
      where: {
        membershipPlanId: id,
      },
    });
    if (!membershipPlanId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid membershipPlanId",
      };
      return response.status(400).send(errorResponse);
    }

    const deleteMembershipPlan = await this.membershipPlanService.delete(id);
    console.log("membershipPlan" + deleteMembershipPlan);
    if (deleteMembershipPlan) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted membershipPlan",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete membershipPlan",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
