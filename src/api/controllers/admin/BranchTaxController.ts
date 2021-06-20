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
import { CreateBranchTaxRequest } from "./requests/CreateBranchTaxRequest";
import { BranchTax } from "../../models/BranchTax";
import { BranchTaxService } from "../../services/BranchTaxService";
import { TaxService } from "../../services/TaxService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-tax")
export class BranchTaxController {
  constructor(
    private branchTaxService: BranchTaxService,
    private taxService: TaxService,
    private branchService: BranchService
  ) {}

  // Create Branch Tax API
  /**
   * @api {post} /api/branch-tax/create-branch-tax Create Branch Tax API
   * @apiGroup Branch Tax
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} taxId taxId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "taxId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Tax is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-tax/create-branch-tax
   * @apiErrorExample {json} createBranchTax error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-tax")
  @Authorized()
  public async createBranchTax(
    @Body({ validate: true }) createBranchTaxParam: CreateBranchTaxRequest,
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
    const newBranchTax: any = new BranchTax();
    newBranchTax.branchId = createBranchTaxParam.branchId;
    newBranchTax.taxId = createBranchTaxParam.taxId;
    newBranchTax.isActive = createBranchTaxParam.status;
    const branchTaxSave = await this.branchTaxService.create(newBranchTax);
    if (branchTaxSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Tax saved successfully",
        data: branchTaxSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Tax",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Tax API
  /**
   * @api {put} /api/branch-tax/update-branch-tax/:id Update Branch Tax API
   * @apiGroup Branch Tax
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} taxId taxId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "taxId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Tax is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-tax/update-branch-tax/:id
   * @apiErrorExample {json} updateBranchTax error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-tax/:id")
  @Authorized()
  public async updateBranchTax(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchTaxParam: CreateBranchTaxRequest,
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
    const branchTax = await this.branchTaxService.findOne({
      where: {
        branchTaxId: id,
      },
    });
    console.log(branchTax);
    if (!branchTax) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchTaxId",
      };
      return response.status(400).send(errorResponse);
    }
    branchTax.branchId = createBranchTaxParam.branchId;
    branchTax.taxId = createBranchTaxParam.taxId;
    branchTax.isActive = createBranchTaxParam.status;
    const branchTaxUpdate = await this.branchTaxService.update(
      id,
      branchTax
    );
    if (branchTaxUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Tax updated successfully",
        data: branchTaxUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Tax",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Tax List API
  /**
   * @api {get} /api/branch-tax/branch-tax-list Branch Tax List API
   * @apiGroup Branch Tax
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} taxId taxId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Tax list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-tax/branch-tax-list
   * @apiErrorExample {json} branch Tax error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-tax-list")
  @Authorized()
  public async branchTaxList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("taxId") taxId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "taxId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "taxId",
        op: "where",
        value: taxId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchTaxList = await this.branchTaxService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bTax = val.map(async (value: any) => {
          const temp: any = value;
          const tax = await this.taxService.findOne({
            where: { taxId: temp.taxId },
          });
          temp.taxName = tax.name;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bTax);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchTax List",
      data: branchTaxList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Tax API
  /**
   * @api {delete} /api/branch-tax/delete-branch-tax/:id Delete Branch Tax API
   * @apiGroup Branch Tax
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch tax.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-tax/delete-branch-tax/:id
   * @apiErrorExample {json} Branch Tax error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-tax/:id")
  @Authorized()
  public async deleteBranchTax(
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
    const branchTaxId = await this.branchTaxService.findOne({
      where: {
        branchTaxId: id,
      },
    });
    if (!branchTaxId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchTaxId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchTax = await this.branchTaxService.delete(id);
    console.log("branchTax" + branchTax);
    if (branchTax) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch tax",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch tax",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
