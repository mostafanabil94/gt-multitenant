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
import { CreateMembershipRequest } from "./requests/CreateMembershipRequest";
import { MembershipService } from "../../services/MembershipService";
import { Membership } from "../../models/Membership";

@JsonController("/membership")
export class MembershipController {
  constructor(
    private membershipService: MembershipService
  ) {}

  // Create Membership API
  /**
   * @api {post} /api/membership/create-membership Create Membership API
   * @apiGroup Membership
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {String} description description
   * @apiParam (Request body) {Boolean} isPrivate isPrivate
   * @apiParam (Request body) {Boolean} isOnePurchase isOnePurchase
   * @apiParam (Request body) {Boolean} isTrial isTrial
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
   *      "message": "New Membership is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership/create-membership
   * @apiErrorExample {json} createMembership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-membership")
  @Authorized()
  public async createMembership(
    @Body({ validate: true }) createMembershipParam: CreateMembershipRequest,
    @Res() response: any
  ): Promise<any> {
    console.log(createMembershipParam);
    const membership = await this.membershipService.findOne({
      where: {
        name: createMembershipParam.name,
      },
    });
    console.log(membership);
    if (membership) {
      const errorResponse: any = {
        status: 0,
        message: "this membership already exist",
      };
      return response.status(400).send(errorResponse);
    }

    const newMembershipParams: any = new Membership();
    newMembershipParams.name = createMembershipParam.name;
    newMembershipParams.description = createMembershipParam.description;
    newMembershipParams.isPrivate = createMembershipParam.isPrivate;
    newMembershipParams.isTrial = createMembershipParam.isTrial;
    newMembershipParams.isOnePurchase = createMembershipParam.isOnePurchase;
    newMembershipParams.isActive = createMembershipParam.status;
    const membershipSaveResponse = await this.membershipService.create(
      newMembershipParams
    );
    if (membershipSaveResponse) {
      const successResponse: any = {
        status: 1,
        message: "Membership saved successfully",
        data: membershipSaveResponse,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Membership",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Membership API
  /**
   * @api {put} /api/membership/update-membership/:id Update Membership API
   * @apiGroup Membership
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
   *      "message": " Membership is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership/update-membership/:id
   * @apiErrorExample {json} updateMembership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-membership/:id")
  @Authorized()
  public async updateMembership(
    @Param("id") id: number,
    @Body({ validate: true }) createMembershipParam: CreateMembershipRequest,
    @Res() response: any
  ): Promise<any> {
    console.log(createMembershipParam);
    const membership = await this.membershipService.findOne({
      where: {
        membershipId: id,
      },
    });
    console.log(membership);
    if (!membership) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid membershipId",
      };
      return response.status(400).send(errorResponse);
    }

    membership.name = createMembershipParam.name;
    membership.description = createMembershipParam.description;
    membership.isPrivate = createMembershipParam.isPrivate;
    membership.isTrial = createMembershipParam.isTrial;
    membership.isOnePurchase = createMembershipParam.isOnePurchase;
    membership.isActive = createMembershipParam.status;
    const membershipSaveResponse = await this.membershipService.update(
      id,
      membership
    );
    if (membershipSaveResponse) {
      const successResponse: any = {
        status: 1,
        message: "Membership updated successfully",
        data: membershipSaveResponse,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Membership",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Membership List API
  /**
   * @api {get} /api/membership/membershiplist Membership List API
   * @apiGroup Membership
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {Number} isTrial isTrial
   * @apiParam (Request body) {Number} isOnePurchase isOnePurchase
   * @apiParam (Request body) {Number} isPrivate isPrivate
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {String} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get membership list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/membership/membershiplist
   * @apiErrorExample {json} membership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/membershiplist")
  @Authorized()
  public async membershipList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    @QueryParam("isTrial") isTrial: number,
    @QueryParam("isPrivate") isPrivate: number,
    @QueryParam("isOnePurchase") isOnePurchase: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    console.log(keyword);
    const select = ["membershipId", "name", "description", "isTrial", "isOnePurchase", "isPrivate", "isActive"];
    const whereConditions = [
      {
        name: "isActive",
        op: "where",
        value: status,
      },
    ];

    const search = [];

    if (keyword !== undefined && keyword !== '') {
      search.push({
        name: "name",
        op: "like",
        value: keyword,
      });
    }

    if (isTrial !== undefined) {
        search.push({
            name: "isTrial",
            op: "where",
            value: isTrial,
        });
    }

    if (isPrivate !== undefined) {
        search.push({
            name: "isPrivate",
            op: "where",
            value: isPrivate,
        });
    }

    if (isOnePurchase !== undefined) {
        search.push({
            name: "isOnePurchase",
            op: "where",
            value: isOnePurchase,
        });
    }

    const relations = [];

    const membershipList = await this.membershipService.list(
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
      message: "Successfully get all membership List",
      data: membershipList,
    };
    return response.status(200).send(successResponse);
  }
  // delete Membership API
  /**
   * @api {delete} /api/membership/delete-membership/:id Delete Membership API
   * @apiGroup Membership
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {number} membershipId  membershipId
   * @apiParamExample {json} Input
   * {
   *      "membershipId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted Membership.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/membership/delete-membership/:id
   * @apiErrorExample {json} Membership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-membership/:id")
  @Authorized()
  public async deleteMembership(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const membershipId = await this.membershipService.findOne({
      where: {
        membershipId: id,
      },
    });
    if (!membershipId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid membershipId",
      };
      return response.status(400).send(errorResponse);
    }

    const deleteMembership = await this.membershipService.delete(id);
    console.log("membership" + deleteMembership);
    if (deleteMembership) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted membership",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete membership",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
