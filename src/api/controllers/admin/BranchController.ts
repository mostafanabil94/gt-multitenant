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
import { BranchService } from "../../services/BranchService";
import { Branch } from "../../models/Branch";
import { CreateBranchRequest } from "./requests/CreateBranchRequest";
import { BrandService } from "../../services/BrandService";

@JsonController("/branch")
export class BranchController {
  constructor(
    private branchService: BranchService,
    private brandService: BrandService
  ) {}

  // Create branch API
  /**
   * @api {post} /api/branch/add-branch Add Branch API
   * @apiGroup Branch
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
   *      "message": "Successfully created new branch.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch/add-branch
   * @apiErrorExample {json} Branch error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/add-branch")
  @Authorized()
  public async addBranch(
    @Body({ validate: true }) createParam: CreateBranchRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const brand = await this.brandService.findOne({
      where: { brandId: createParam.brandId },
    });
    if (!brand) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid brandId",
      };
      return response.status(400).send(errorResponse);
    }
    const newBranch = new Branch();
    newBranch.brandId = createParam.brandId;
    newBranch.name = createParam.name;
    newBranch.email = createParam.email;
    newBranch.legalName = createParam.legalName;
    newBranch.phone = createParam.email;
    newBranch.isActive = createParam.status;
    newBranch.createdByType = 1;
    newBranch.createdBy = request.user.userId;
    const branchSave = await this.branchService.create(newBranch);
    if (branchSave !== undefined) {
      const successResponse: any = {
        status: 1,
        message: "Successfully created new Branch",
        data: branchSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to create Branch",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch API
  /**
   * @api {put} /api/branch/update-branch/:branchId Update Branch API
   * @apiGroup Branch
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
   *      "message": "Successfully updated Branch.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch/update-branch/:branchId
   * @apiErrorExample {json} Branch error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch/:branchId")
  @Authorized()
  public async updateBranch(
    @Param("branchId") branchId: number,
    @Body({ validate: true }) updateParam: CreateBranchRequest,
    @Req() request: any,
    @Res() response: any
  ): Promise<any> {
    const branch = await this.branchService.findOne({
      where: {
        branchId,
      },
    });
    if (!branch) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchId",
      };
      return response.status(400).send(errorResponse);
    }
    const brand = await this.brandService.findOne({
      where: { brandId: updateParam.brandId },
    });
    if (!brand) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchId",
      };
      return response.status(400).send(errorResponse);
    }
    branch.brandId = updateParam.brandId;
    branch.name = updateParam.name;
    branch.email = updateParam.email;
    branch.legalName = updateParam.legalName;
    branch.phone = updateParam.email;
    branch.isActive = updateParam.status;
    branch.modifiedByType = 1;
    branch.modifiedBy = request.user.userId;
    const branchSave = await this.branchService.create(branch);
    if (branchSave !== undefined) {
      const successResponse: any = {
        status: 1,
        message: "Successfully updated branch",
        data: branchSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update branch",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch List API
  /**
   * @api {get} /api/branch/branch-list Branch List API
   * @apiGroup Branch
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
   * @apiSampleRequest /api/branch/branch-list
   * @apiErrorExample {json} Branch error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-list")
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

    const branchList = await this.branchService.list(
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

  // Delete Branch API
  /**
   * @api {delete} /api/branch/delete-branch/:branchId Delete Branch API
   * @apiGroup Branch
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted Branch.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch/delete-branch/:branchId
   * @apiErrorExample {json} Branch error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch/:branchId")
  @Authorized()
  public async deleteBranch(
    @Param("branchId") branchId: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const branch = await this.branchService.findOne({
      where: {
        branchId,
      },
    });
    if (!branch) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchId",
      };
      return response.status(400).send(errorResponse);
    }

    const deleteBranch = await this.branchService.delete(branch);
    console.log("branch" + deleteBranch);
    if (deleteBranch) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
