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
import { CreateBranchSalesRequest } from "./requests/CreateBranchSalesRequest";
import { BranchSales } from "../../models/BranchSales";
import { BranchSalesService } from "../../services/BranchSalesService";
import { SalesService } from "../../services/SalesService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-sales")
export class BranchSalesController {
  constructor(
    private branchSalesService: BranchSalesService,
    private salesService: SalesService,
    private branchService: BranchService
  ) {}

  // Create Branch Sales API
  /**
   * @api {post} /api/branch-sales/create-branch-sales Create Branch Sales API
   * @apiGroup Branch Sales
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} salesId salesId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "salesId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Sales is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-sales/create-branch-sales
   * @apiErrorExample {json} createBranchSales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-sales")
  @Authorized()
  public async createBranchSales(
    @Body({ validate: true }) createBranchSalesParam: CreateBranchSalesRequest,
    @Res() response: any
  ): Promise<any> {
    const newBranchSales: any = new BranchSales();
    newBranchSales.branchId = createBranchSalesParam.branchId;
    newBranchSales.salesId = createBranchSalesParam.salesId;
    newBranchSales.isActive = createBranchSalesParam.status;
    const branchSalesSave = await this.branchSalesService.create(newBranchSales);
    if (branchSalesSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Sales saved successfully",
        data: branchSalesSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Sales",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Sales API
  /**
   * @api {put} /api/branch-sales/update-branch-sales/:id Update Branch Sales API
   * @apiGroup Branch Sales
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} salesId salesId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "salesId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Sales is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-sales/update-branch-sales/:id
   * @apiErrorExample {json} updateBranchSales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-sales/:id")
  @Authorized()
  public async updateBranchSales(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchSalesParam: CreateBranchSalesRequest,
    @Res() response: any
  ): Promise<any> {
    const branchSales = await this.branchSalesService.findOne({
      where: {
        branchSalesId: id,
      },
    });
    console.log(branchSales);
    if (!branchSales) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchSalesId",
      };
      return response.status(400).send(errorResponse);
    }
    branchSales.branchId = createBranchSalesParam.branchId;
    branchSales.salesId = createBranchSalesParam.salesId;
    branchSales.isActive = createBranchSalesParam.status;
    const branchSalesUpdate = await this.branchSalesService.update(
      id,
      branchSales
    );
    if (branchSalesUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Sales updated successfully",
        data: branchSalesUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Sales",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Sales List API
  /**
   * @api {get} /api/branch-sales/branch-sales-list Branch Sales List API
   * @apiGroup Branch Sales
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} salesId salesId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Sales list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-sales/branch-sales-list
   * @apiErrorExample {json} branch Sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-sales-list")
  @Authorized()
  public async branchSalesList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("salesId") salesId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "salesId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "salesId",
        op: "where",
        value: salesId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchSalesList = await this.branchSalesService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bSales = val.map(async (value: any) => {
          const temp: any = value;
          const sales = await this.salesService.findOne({
            where: { salesId: temp.salesId },
          });
          temp.salesName = sales.firstName + ' ' + sales.lastName;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bSales);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchSales List",
      data: branchSalesList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Sales API
  /**
   * @api {delete} /api/branch-sales/delete-branch-sales/:id Delete Branch Sales API
   * @apiGroup Branch Sales
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch sales.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-sales/delete-branch-sales/:id
   * @apiErrorExample {json} Branch Sales error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-sales/:id")
  @Authorized()
  public async deleteBranchSales(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const branchSalesId = await this.branchSalesService.findOne({
      where: {
        branchSalesId: id,
      },
    });
    if (!branchSalesId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchSalesId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchSales = await this.branchSalesService.delete(id);
    console.log("branchSales" + branchSales);
    if (branchSales) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch sales",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch sales",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
