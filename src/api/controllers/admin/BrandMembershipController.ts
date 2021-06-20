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
import { CreateBrandMembershipRequest } from "./requests/CreateBrandMembershipRequest";
import { BrandMembership } from "../../models/BrandMembership";
import { BrandMembershipService } from "../../services/BrandMembershipService";
import { MembershipService } from "../../services/MembershipService";
import { BrandService } from "../../services/BrandService";

@JsonController("/brand-membership")
export class BrandMembershipController {
  constructor(
    private brandMembershipService: BrandMembershipService,
    private membershipService: MembershipService,
    private brandService: BrandService
  ) {}

  // Create Brand Membership API
  /**
   * @api {post} /api/brand-membership/create-brand-membership Create Brand Membership API
   * @apiGroup Brand Membership
   * @apiParam (Request body) {Number} brandId brandId
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "brandId" : "",
   *      "membershipId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Brand Membership is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-membership/create-brand-membership
   * @apiErrorExample {json} createBrandMembership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-brand-membership")
  @Authorized()
  public async createBrandMembership(
    @Body({ validate: true }) createBrandMembershipParam: CreateBrandMembershipRequest,
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
    const newBrandMembership: any = new BrandMembership();
    newBrandMembership.brandId = createBrandMembershipParam.brandId;
    newBrandMembership.membershipId = createBrandMembershipParam.membershipId;
    newBrandMembership.isActive = createBrandMembershipParam.status;
    const brandMembershipSave = await this.brandMembershipService.create(newBrandMembership);
    if (brandMembershipSave) {
      const successResponse: any = {
        status: 1,
        message: "Brand Membership saved successfully",
        data: brandMembershipSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Brand Membership",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Brand Membership API
  /**
   * @api {put} /api/brand-membership/update-brand-membership/:id Update Brand Membership API
   * @apiGroup Brand Membership
   * @apiParam (Request body) {Number} brandId brandId
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "brandId" : "",
   *      "membershipId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Brand Membership is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-membership/update-brand-membership/:id
   * @apiErrorExample {json} updateBrandMembership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-brand-membership/:id")
  @Authorized()
  public async updateBrandMembership(
    @Param("id") id: number,
    @Body({ validate: true }) createBrandMembershipParam: CreateBrandMembershipRequest,
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
    const brandMembership = await this.brandMembershipService.findOne({
      where: {
        brandMembershipId: id,
      },
    });
    console.log(brandMembership);
    if (!brandMembership) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandMembershipId",
      };
      return response.status(400).send(errorResponse);
    }
    brandMembership.brandId = createBrandMembershipParam.brandId;
    brandMembership.membershipId = createBrandMembershipParam.membershipId;
    brandMembership.isActive = createBrandMembershipParam.status;
    const brandMembershipUpdate = await this.brandMembershipService.update(
      id,
      brandMembership
    );
    if (brandMembershipUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Brand Membership updated successfully",
        data: brandMembershipUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Brand Membership",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Brand Membership List API
  /**
   * @api {get} /api/brand-membership/brand-membership-list Brand Membership List API
   * @apiGroup Brand Membership
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} brandId brandId
   * @apiParam (Request body) {Number} membershipId membershipId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Brand Membership list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/brand-membership/brand-membership-list
   * @apiErrorExample {json} brand Membership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/brand-membership-list")
  @Authorized()
  public async brandMembershipList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("brandId") brandId: number,
    @QueryParam("membershipId") membershipId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["brandId", "membershipId", "isActive"];
    const whereConditions = [
      {
        name: "brandId",
        op: "where",
        value: brandId,
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

    const brandMembershipList = await this.brandMembershipService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bMembership = val.map(async (value: any) => {
          const temp: any = value;
          const membership = await this.membershipService.findOne({
            where: { membershipId: temp.membershipId },
          });
          temp.membershipName = membership.name;
          const brand = await this.brandService.findOne({
            where: { brandId: temp.brandId },
          });
          temp.brandName = brand.name;
          return temp;
        });
        const results = Promise.all(bMembership);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all brandMembership List",
      data: brandMembershipList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Brand Membership API
  /**
   * @api {delete} /api/brand-membership/delete-brand-membership/:id Delete Brand Membership API
   * @apiGroup Brand Membership
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted brand membership.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-membership/delete-brand-membership/:id
   * @apiErrorExample {json} Brand Membership error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-brand-membership/:id")
  @Authorized()
  public async deleteBrandMembership(
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
    const brandMembershipId = await this.brandMembershipService.findOne({
      where: {
        brandMembershipId: id,
      },
    });
    if (!brandMembershipId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandMembershipId",
      };
      return response.status(400).send(errorResponse);
    }

    const brandMembership = await this.brandMembershipService.delete(id);
    console.log("brandMembership" + brandMembership);
    if (brandMembership) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted brand membership",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete brand membership",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
