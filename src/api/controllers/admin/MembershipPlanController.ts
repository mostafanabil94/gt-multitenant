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

@JsonController("/membership-plan")
export class MembershipPlanController {
  constructor(private membershipPlanService: MembershipPlanService) {}

  // Create Membership Plan API
  /**
   * @api {post} /api/membership-plan/create-membership-plan Create Membership Plan API
   * @apiGroup Membership Plan
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} isMultipleClients isMultipleClients
   * @apiParam (Request body) {Number} maxNumberOfClients maxNumberOfClients
   * @apiParam (Request body) {Number} type type
   * @apiParam (Request body) {Number} price price
   * @apiParam (Request body) {Number} periodType periodType
   * @apiParam (Request body) {Number} forPeriod forPeriod
   * @apiParam (Request body) {Number} everyPeriod everyPeriod
   * @apiParam (Request body) {Number} isStartMonth isStartMonth
   * @apiParam (Request body) {Number} isFreePeriod isFreePeriod
   * @apiParam (Request body) {Number} isProrate isProrate
   * @apiParam (Request body) {Number} isEndingPeriod isEndingPeriod
   * @apiParam (Request body) {Number} endPeriod endPeriod
   * @apiParam (Request body) {Number} isAutorenew isAutorenew
   * @apiParam (Request body) {Number} isJoiningFee isJoiningFee
   * @apiParam (Request body) {Number} joiningFee joiningFee
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "name" : "",
   *      "membershipId" : "",
   *      "isMultipleClients" : "",
   *      "maxNumberOfClients" : "",
   *      "type" : "",
   *      "price" : "",
   *      "periodType" : "",
   *      "forPeriod" : "",
   *      "everyPeriod" : "",
   *      "isStartMonth" : "",
   *      "isFreePeriod" : "",
   *      "isProrate" : "",
   *      "isEndingPeriod" : "",
   *      "endPeriod" : "",
   *      "isAutorenew" : "",
   *      "isJoiningFee" : "",
   *      "joiningFee" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New MembershipPlan is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership-plan/create-membership-plan
   * @apiErrorExample {json} createMembershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-membership-plan")
  @Authorized()
  public async createMembershipPlan(
    @Body({ validate: true })
    createMembershipPlanParam: CreateMembershipPlanRequest,
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
        message: "this membership plan name already exist",
      };
      return response.status(400).send(errorResponse);
    }

    const newMembershipPlanParams: any = new MembershipPlan();
    newMembershipPlanParams.name = createMembershipPlanParam.name;
    newMembershipPlanParams.membershipId =
      createMembershipPlanParam.membershipId;
    newMembershipPlanParams.isMultipleClients =
      createMembershipPlanParam.isMultipleClients;
    newMembershipPlanParams.maxNumberOfClients =
      createMembershipPlanParam.maxNumberOfClients;
    newMembershipPlanParams.type = createMembershipPlanParam.type;
    newMembershipPlanParams.price = createMembershipPlanParam.price;
    newMembershipPlanParams.periodType = createMembershipPlanParam.periodType;
    newMembershipPlanParams.forPeriod = createMembershipPlanParam.forPeriod;
    newMembershipPlanParams.everyPeriod = createMembershipPlanParam.everyPeriod;
    newMembershipPlanParams.isStartMonth =
      createMembershipPlanParam.isStartMonth;
    newMembershipPlanParams.isFreePeriod =
      createMembershipPlanParam.isFreePeriod;
    newMembershipPlanParams.isProrate = createMembershipPlanParam.isProrate;
    newMembershipPlanParams.isEndingPeriod =
      createMembershipPlanParam.isEndingPeriod;
    newMembershipPlanParams.endPeriod = createMembershipPlanParam.endPeriod;
    newMembershipPlanParams.isAutorenew = createMembershipPlanParam.isAutorenew;
    newMembershipPlanParams.isJoiningFee =
      createMembershipPlanParam.isJoiningFee;
    newMembershipPlanParams.joiningFee = createMembershipPlanParam.joiningFee;
    newMembershipPlanParams.isActive = createMembershipPlanParam.status;
    const membershipPlanSaveResponse = await this.membershipPlanService.create(
      newMembershipPlanParams
    );
    if (membershipPlanSaveResponse) {
      const successResponse: any = {
        status: 1,
        message: "Membership plan saved successfully",
        data: membershipPlanSaveResponse,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Membership plan",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Membership Plan API
  /**
   * @api {put} /api/membership-plan/update-membership-plan/:id Update Membership Plan API
   * @apiGroup Membership Plan
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} isMultipleClients isMultipleClients
   * @apiParam (Request body) {Number} maxNumberOfClients maxNumberOfClients
   * @apiParam (Request body) {Number} type type
   * @apiParam (Request body) {Number} price price
   * @apiParam (Request body) {Number} periodType periodType
   * @apiParam (Request body) {Number} forPeriod forPeriod
   * @apiParam (Request body) {Number} everyPeriod everyPeriod
   * @apiParam (Request body) {Number} isStartMonth isStartMonth
   * @apiParam (Request body) {Number} isFreePeriod isFreePeriod
   * @apiParam (Request body) {Number} isProrate isProrate
   * @apiParam (Request body) {Number} isEndingPeriod isEndingPeriod
   * @apiParam (Request body) {Number} endPeriod endPeriod
   * @apiParam (Request body) {Number} isAutorenew isAutorenew
   * @apiParam (Request body) {Number} isJoiningFee isJoiningFee
   * @apiParam (Request body) {Number} joiningFee joiningFee
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "name" : "",
   *      "membershipId" : "",
   *      "isMultipleClients" : "",
   *      "maxNumberOfClients" : "",
   *      "type" : "",
   *      "price" : "",
   *      "periodType" : "",
   *      "forPeriod" : "",
   *      "everyPeriod" : "",
   *      "isStartMonth" : "",
   *      "isFreePeriod" : "",
   *      "isProrate" : "",
   *      "isEndingPeriod" : "",
   *      "endPeriod" : "",
   *      "isAutorenew" : "",
   *      "isJoiningFee" : "",
   *      "joiningFee" : "",
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
    @Body({ validate: true })
    createMembershipPlanParam: CreateMembershipPlanRequest,
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

    membershipPlan.name = createMembershipPlanParam.name;
    membershipPlan.membershipId = createMembershipPlanParam.membershipId;
    membershipPlan.isMultipleClients =
      createMembershipPlanParam.isMultipleClients;
    membershipPlan.maxNumberOfClients =
      createMembershipPlanParam.maxNumberOfClients;
    membershipPlan.type = createMembershipPlanParam.type;
    membershipPlan.price = createMembershipPlanParam.price;
    membershipPlan.periodType = createMembershipPlanParam.periodType;
    membershipPlan.forPeriod = createMembershipPlanParam.forPeriod;
    membershipPlan.everyPeriod = createMembershipPlanParam.everyPeriod;
    membershipPlan.isStartMonth = createMembershipPlanParam.isStartMonth;
    membershipPlan.isFreePeriod = createMembershipPlanParam.isFreePeriod;
    membershipPlan.isProrate = createMembershipPlanParam.isProrate;
    membershipPlan.isEndingPeriod = createMembershipPlanParam.isEndingPeriod;
    membershipPlan.endPeriod = createMembershipPlanParam.endPeriod;
    membershipPlan.isAutorenew = createMembershipPlanParam.isAutorenew;
    membershipPlan.isJoiningFee = createMembershipPlanParam.isJoiningFee;
    membershipPlan.joiningFee = createMembershipPlanParam.joiningFee;
    membershipPlan.isActive = createMembershipPlanParam.status;
    const membershipPlanSaveResponse = await this.membershipPlanService.update(
      id,
      membershipPlan
    );
    if (membershipPlanSaveResponse) {
      const successResponse: any = {
        status: 1,
        message: "Membership plan updated successfully",
        data: membershipPlanSaveResponse,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Membership plan",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Membership Plan List API
  /**
   * @api {get} /api/membership-plan/membership-plan-list Membership Plan List API
   * @apiGroup Membership Plan
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {Number} isMultipleClients isMultipleClients
   * @apiParam (Request body) {Number} isStartMonth isStartMonth
   * @apiParam (Request body) {Number} isFreePeriod isFreePeriod
   * @apiParam (Request body) {Number} isProrate isProrate
   * @apiParam (Request body) {Number} isEndingPeriod isEndingPeriod
   * @apiParam (Request body) {Number} isAutorenew isAutorenew
   * @apiParam (Request body) {Number} isJoiningFee isJoiningFee
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {String} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get membership plan list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/membership-plan/membership-plan-list
   * @apiErrorExample {json} membershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/membership-plan-list")
  @Authorized()
  public async membershipPlanList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    @QueryParam("isMultipleClients") isMultipleClients: number,
    @QueryParam("isStartMonth") isStartMonth: number,
    @QueryParam("isFreePeriod") isFreePeriod: number,
    @QueryParam("isProrate") isProrate: number,
    @QueryParam("isEndingPeriod") isEndingPeriod: number,
    @QueryParam("isAutorenew") isAutorenew: number,
    @QueryParam("isJoiningFee") isJoiningFee: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    console.log(keyword);
    const select = [];
    const whereConditions = [
      {
        name: "isActive",
        op: "where",
        value: status,
      },
    ];

    const search = [];

    if (keyword !== undefined && keyword !== "") {
      search.push({
        name: "name",
        op: "like",
        value: keyword,
      });
    }

    if (isMultipleClients !== undefined) {
      search.push({
        name: "isMultipleClients",
        op: "where",
        value: isMultipleClients,
      });
    }

    if (isStartMonth !== undefined) {
      search.push({
        name: "isStartMonth",
        op: "where",
        value: isStartMonth,
      });
    }

    if (isFreePeriod !== undefined) {
      search.push({
        name: "isFreePeriod",
        op: "where",
        value: isFreePeriod,
      });
    }

    if (isProrate !== undefined) {
      search.push({
        name: "isProrate",
        op: "where",
        value: isProrate,
      });
    }

    if (isEndingPeriod !== undefined) {
      search.push({
        name: "isEndingPeriod",
        op: "where",
        value: isEndingPeriod,
      });
    }

    if (isAutorenew !== undefined) {
      search.push({
        name: "isAutorenew",
        op: "where",
        value: isAutorenew,
      });
    }

    if (isJoiningFee !== undefined) {
      search.push({
        name: "isJoiningFee",
        op: "where",
        value: isJoiningFee,
      });
    }

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
      message: "Successfully get all membership plan List",
      data: membershipPlanList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Membership Plan API
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
    if (request.user.userGroupId !== 1 && request.user.userGroupId !== 2) {
      const errorResponse: any = {
        status: 0,
        message: "Only Super Admin and Admin has permission for this action",
      };
      return response.status(400).send(errorResponse);
    }
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
        message: "Successfully deleted membership plan",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete membership plan",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
