import "reflect-metadata";
import {
  Get,
  Put,
  Delete,
  Post,
  Body,
  JsonController,
  Authorized,
  Res,
  Req,
  QueryParam,
  Param,
} from "routing-controllers";
import { BrandService } from "../../services/BrandService";
import { Brand } from "../../models/Brand";
import { CreateBrandRequest } from "./requests/CreateBrandRequest";

@JsonController("/brand")
export class BrandController {
  constructor(private brandService: BrandService) {}

  // Create brand API
  /**
   * @api {post} /api/brand/add-brand Add Brand API
   * @apiGroup Brand
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {String} email email
   * @apiParam (Request body) {String} logo logo
   * @apiParam (Request body) {String} image image
   * @apiParam (Request body) {String} legalName legalName
   * @apiParam (Request body) {String} phone phone
   * @apiParam (Request body) {Number} status status
   * @apiParamExample {json} Input
   * {
   *      "name" : "",
   *      "email" : "",
   *      "logo" : "",
   *      "image" : "",
   *      "legalName" : "",
   *      "phone" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully created new brand.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand/add-brand
   * @apiErrorExample {json} Brand error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/add-brand")
  @Authorized()
  public async addBrand(
    @Body({ validate: true }) createParam: CreateBrandRequest,
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
    console.log(request.user);
    const newBrand = new Brand();
    newBrand.name = createParam.name;
    newBrand.email = createParam.email;
    newBrand.legalName = createParam.legalName;
    newBrand.phone = createParam.email;
    newBrand.isActive = createParam.status;
    newBrand.createdByType = 1;
    newBrand.createdBy = request.user.userId;
    const brandSave = await this.brandService.create(newBrand);
    if (brandSave !== undefined) {
      const successResponse: any = {
        status: 1,
        message: "Successfully created new Brand",
        data: brandSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to create Brand",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Brand API
  /**
   * @api {put} /api/brand/update-brand/:brandId Update Brand API
   * @apiGroup Brand
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {String} name name
   * @apiParam (Request body) {String} email email
   * @apiParam (Request body) {String} logo logo
   * @apiParam (Request body) {String} image image
   * @apiParam (Request body) {String} legalName legalName
   * @apiParam (Request body) {String} phone phone
   * @apiParam (Request body) {Number} status status
   * @apiParamExample {json} Input
   * {
   *      "name" : "",
   *      "email" : "",
   *      "logo" : "",
   *      "image" : "",
   *      "legalName" : "",
   *      "phone" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully updated Brand.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand/update-brand/:brandId
   * @apiErrorExample {json} Brand error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-brand/:brandId")
  @Authorized()
  public async updateBrand(
    @Param("brandId") brandId: number,
    @Body({ validate: true }) updateParam: CreateBrandRequest,
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
    const brand = await this.brandService.findOne({
      where: {
        brandId,
      },
    });
    if (!brand) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandId",
      };
      return response.status(400).send(errorResponse);
    }
    brand.name = updateParam.name;
    brand.email = updateParam.email;
    brand.legalName = updateParam.legalName;
    brand.phone = updateParam.email;
    brand.isActive = updateParam.status;
    brand.modifiedByType = 1;
    brand.modifiedBy = request.user.userId;
    const brandSave = await this.brandService.create(brand);
    if (brandSave !== undefined) {
      const successResponse: any = {
        status: 1,
        message: "Successfully updated brand",
        data: brandSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update brand",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Brand List API
  /**
   * @api {get} /api/brand/brand-list Brand List API
   * @apiGroup Brand
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {String} status status
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get brand list",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand/brand-list
   * @apiErrorExample {json} Brand error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/brand-list")
  @Authorized()
  public async brandList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
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
    ];

    const WhereConditions = [];
    if (status === "0" || status) {
      WhereConditions.push({
        name: "isActive",
        value: status,
      });
    }

    const brandList = await this.brandService.list(
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
      message: "Successfully get all brand List",
      data: brandList,
    };
    return response.status(200).send(successResponse);
  }

  // Delete Brand API
  /**
   * @api {delete} /api/brand/delete-brand/:brandId Delete Brand API
   * @apiGroup Brand
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "brandId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted Brand.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/brand/delete-brand/:brandId
   * @apiErrorExample {json} Brand error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-brand/:brandId")
  @Authorized()
  public async deleteBrand(
    @Param("brandId") brandId: number,
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
    const brand = await this.brandService.findOne({
      where: {
        brandId,
      },
    });
    if (!brand) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandId",
      };
      return response.status(400).send(errorResponse);
    }

    const deleteBrand = await this.brandService.delete(brand);
    console.log("brand" + deleteBrand);
    if (deleteBrand) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted brand",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete brand",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
