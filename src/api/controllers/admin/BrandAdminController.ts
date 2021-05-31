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
import { CreateBrandAdminRequest } from "./requests/CreateBrandAdminRequest";
import { BrandAdmin } from "../../models/BrandAdmin";
import { BrandAdminService } from "../../services/BrandAdminService";
import { UserService } from "../../services/UserService";
import { BrandService } from "../../services/BrandService";

@JsonController("/brand-admin")
export class BrandAdminController {
  constructor(
    private brandAdminService: BrandAdminService,
    private userService: UserService,
    private brandService: BrandService
  ) {}

  // Create Brand Admin API
  /**
   * @api {post} /api/brand-admin/create-brand-admin Create Brand Admin API
   * @apiGroup Brand Admin
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
   *      "message": "New Brand Admin is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-admin/create-brand-admin
   * @apiErrorExample {json} createBrandAdmin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-brand-admin")
  @Authorized()
  public async createBrandAdmin(
    @Body({ validate: true }) createBrandAdminParam: CreateBrandAdminRequest,
    @Res() response: any
  ): Promise<any> {
    const newBrandAdmin: any = new BrandAdmin();
    newBrandAdmin.brandId = createBrandAdminParam.brandId;
    newBrandAdmin.userId = createBrandAdminParam.userId;
    newBrandAdmin.isActive = createBrandAdminParam.status;
    const brandAdminSave = await this.brandAdminService.create(newBrandAdmin);
    if (brandAdminSave) {
      const successResponse: any = {
        status: 1,
        message: "Brand Admin saved successfully",
        data: brandAdminSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Brand Admin",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Brand Admin API
  /**
   * @api {put} /api/brand-admin/update-brand-admin/:id Update Brand Admin API
   * @apiGroup Brand Admin
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
   *      "message": "Brand Admin is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-admin/update-brand-admin/:id
   * @apiErrorExample {json} updateBrandAdmin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-brand-admin/:id")
  @Authorized()
  public async updateBrandAdmin(
    @Param("id") id: number,
    @Body({ validate: true }) createBrandAdminParam: CreateBrandAdminRequest,
    @Res() response: any
  ): Promise<any> {
    const brandAdmin = await this.brandAdminService.findOne({
      where: {
        brandAdminId: id,
      },
    });
    console.log(brandAdmin);
    if (!brandAdmin) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandAdminId",
      };
      return response.status(400).send(errorResponse);
    }
    brandAdmin.brandId = createBrandAdminParam.brandId;
    brandAdmin.userId = createBrandAdminParam.userId;
    brandAdmin.isActive = createBrandAdminParam.status;
    const brandAdminUpdate = await this.brandAdminService.update(
      id,
      brandAdmin
    );
    if (brandAdminUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Brand Admin updated successfully",
        data: brandAdminUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Brand Admin",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Brand Admin List API
  /**
   * @api {get} /api/brand-admin/brand-admin-list Brand Admin List API
   * @apiGroup Brand Admin
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
   *    "message": "Successfully get Brand Admin list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/brand-admin/brand-admin-list
   * @apiErrorExample {json} brand Admin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/brand-admin-list")
  @Authorized()
  public async brandAdminList(
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

    const brandAdminList = await this.brandAdminService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bAdmin = val.map(async (value: any) => {
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
        const results = Promise.all(bAdmin);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all brandAdmin List",
      data: brandAdminList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Brand Admin API
  /**
   * @api {delete} /api/brand-admin/delete-brand-admin/:id Delete Brand Admin API
   * @apiGroup Brand Admin
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted brand admin.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand-admin/delete-brand-admin/:id
   * @apiErrorExample {json} Brand Admin error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-brand-admin/:id")
  @Authorized()
  public async deleteRole(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const brandAdminId = await this.brandAdminService.findOne({
      where: {
        brandAdminId: id,
      },
    });
    if (!brandAdminId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandAdminId",
      };
      return response.status(400).send(errorResponse);
    }

    const brandAdmin = await this.brandAdminService.delete(id);
    console.log("brandAdmin" + brandAdmin);
    if (brandAdmin) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted brand admin",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete brand admin",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
