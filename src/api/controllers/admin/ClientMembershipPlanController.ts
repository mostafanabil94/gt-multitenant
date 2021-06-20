import "reflect-metadata";
import {
  Get,
  Post,
  Body,
  JsonController,
  Authorized,
  Res,
  Req,
  QueryParam,
} from "routing-controllers";
import { ClientMembershipPlanService } from "../../services/ClientMembershipPlanService";
import { ClientMembershipPlan } from "../../models/ClientMembershipPlan";
import { CreateClientMembershipPlanRequest } from "./requests/CreateClientMembershipPlanRequest";

@JsonController("/client-membership-plan")
export class ClientMembershipPlanController {
  constructor(
    private clientMembershipPlanService: ClientMembershipPlanService
  ) {}

  // Create Client Membership Plan API
  /**
   * @api {post} /api/client-membership-plan/create-client-membership-plan Create Client Membership Plan API
   * @apiGroup Client Membership Plan
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} customerId customerId
   * @apiParam (Request body) {String} membershipPlanId membershipPlanId
   * @apiParam (Request body) {String} salesId salesId
   * @apiParamExample {json} Input
   * {
   *      "customerId" : "",
   *      "membershipPlanId" : "",
   *      "salesId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully created new branch.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/client-membership-plan/create-client-membership-plan
   * @apiErrorExample {json} ClientMembershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-client-membership-plan")
  @Authorized()
  public async addClientMembershipPlan(
    @Body({ validate: true }) createParam: CreateClientMembershipPlanRequest,
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
    const newClientMembershipPlan = new ClientMembershipPlan();
    newClientMembershipPlan.customerId = createParam.customerId;
    newClientMembershipPlan.membershipPlanId = createParam.membershipPlanId;
    newClientMembershipPlan.salesId = createParam.salesId;
    // Calculation of startdate, enddate and price upon membershipplan
    newClientMembershipPlan.createdByType = 1;
    newClientMembershipPlan.createdBy = request.user.userId;
    const branchSave = await this.clientMembershipPlanService.create(newClientMembershipPlan);
    if (branchSave !== undefined) {
      const successResponse: any = {
        status: 1,
        message: "Successfully created new ClientMembershipPlan",
        data: branchSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to create ClientMembershipPlan",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Client Membership Plan List API
  /**
   * @api {get} /api/client-membership-plan-list Client Membership Plan List API
   * @apiGroup Client Membership Plan
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {String} status status
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get branch list",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/client-membership-plan-list
   * @apiErrorExample {json} ClientMembershipPlan error
   * HTTP/1.1 500 Internal Server Error
   */
  // add filters from and to dates, customerId, membershipplanId, salesId
  @Get("/client-membership-plan-list")
  @Authorized()
  public async branchList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    @QueryParam("brandId") brandId: number,
    @QueryParam("status") status: string,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = [];

    const search = [
      {
        name: "name",
        op: "like",
        value: keyword,
      },
      {
        name: "brandId",
        op: "like",
        value: brandId,
      },
    ];

    const WhereConditions = [];
    if (status === "0" || status) {
      WhereConditions.push({
        name: "isActive",
        value: status,
      });
    }

    const branchList = await this.clientMembershipPlanService.list(
      limit,
      offset,
      select,
      search,
      WhereConditions,
      keyword,
      count
    );
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branch List",
      data: branchList,
    };
    return response.status(200).send(successResponse);
  }
}
