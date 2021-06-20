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
import { CreateBranchCurrencyRequest } from "./requests/CreateBranchCurrencyRequest";
import { BranchCurrency } from "../../models/BranchCurrency";
import { BranchCurrencyService } from "../../services/BranchCurrencyService";
import { CurrencyService } from "../../services/CurrencyService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-currency")
export class BranchCurrencyController {
  constructor(
    private branchCurrencyService: BranchCurrencyService,
    private currencyService: CurrencyService,
    private branchService: BranchService
  ) {}

  // Create Branch Currency API
  /**
   * @api {post} /api/branch-currency/create-branch-currency Create Branch Currency API
   * @apiGroup Branch Currency
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} currencyId currencyId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "currencyId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Currency is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-currency/create-branch-currency
   * @apiErrorExample {json} createBranchCurrency error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-currency")
  @Authorized()
  public async createBranchCurrency(
    @Body({ validate: true }) createBranchCurrencyParam: CreateBranchCurrencyRequest,
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
    const newBranchCurrency: any = new BranchCurrency();
    newBranchCurrency.branchId = createBranchCurrencyParam.branchId;
    newBranchCurrency.currencyId = createBranchCurrencyParam.currencyId;
    newBranchCurrency.isActive = createBranchCurrencyParam.status;
    const branchCurrencySave = await this.branchCurrencyService.create(newBranchCurrency);
    if (branchCurrencySave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Currency saved successfully",
        data: branchCurrencySave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Currency",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Currency API
  /**
   * @api {put} /api/branch-currency/update-branch-currency/:id Update Branch Currency API
   * @apiGroup Branch Currency
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} currencyId currencyId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "currencyId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Currency is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-currency/update-branch-currency/:id
   * @apiErrorExample {json} updateBranchCurrency error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-currency/:id")
  @Authorized()
  public async updateBranchCurrency(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchCurrencyParam: CreateBranchCurrencyRequest,
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
    const branchCurrency = await this.branchCurrencyService.findOne({
      where: {
        branchCurrencyId: id,
      },
    });
    console.log(branchCurrency);
    if (!branchCurrency) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchCurrencyId",
      };
      return response.status(400).send(errorResponse);
    }
    branchCurrency.branchId = createBranchCurrencyParam.branchId;
    branchCurrency.currencyId = createBranchCurrencyParam.currencyId;
    branchCurrency.isActive = createBranchCurrencyParam.status;
    const branchCurrencyUpdate = await this.branchCurrencyService.update(
      id,
      branchCurrency
    );
    if (branchCurrencyUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Currency updated successfully",
        data: branchCurrencyUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Currency",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Currency List API
  /**
   * @api {get} /api/branch-currency/branch-currency-list Branch Currency List API
   * @apiGroup Branch Currency
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} currencyId currencyId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Currency list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-currency/branch-currency-list
   * @apiErrorExample {json} branch Currency error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-currency-list")
  @Authorized()
  public async branchCurrencyList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("currencyId") currencyId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "currencyId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "currencyId",
        op: "where",
        value: currencyId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchCurrencyList = await this.branchCurrencyService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bCurrency = val.map(async (value: any) => {
          const temp: any = value;
          const currency = await this.currencyService.findOne({
            where: { currencyId: temp.currencyId },
          });
          temp.currencyName = currency.name;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bCurrency);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchCurrency List",
      data: branchCurrencyList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Currency API
  /**
   * @api {delete} /api/branch-currency/delete-branch-currency/:id Delete Branch Currency API
   * @apiGroup Branch Currency
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch currency.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-currency/delete-branch-currency/:id
   * @apiErrorExample {json} Branch Currency error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-currency/:id")
  @Authorized()
  public async deleteBranchCurrency(
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
    const branchCurrencyId = await this.branchCurrencyService.findOne({
      where: {
        branchCurrencyId: id,
      },
    });
    if (!branchCurrencyId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchCurrencyId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchCurrency = await this.branchCurrencyService.delete(id);
    console.log("branchCurrency" + branchCurrency);
    if (branchCurrency) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch currency",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch currency",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
