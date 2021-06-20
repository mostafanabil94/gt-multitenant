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
import { CreateBranchCustomerRequest } from "./requests/CreateBranchCustomerRequest";
import { BranchCustomer } from "../../models/BranchCustomer";
import { BranchCustomerService } from "../../services/BranchCustomerService";
import { CustomerService } from "../../services/CustomerService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-customer")
export class BranchCustomerController {
  constructor(
    private branchCustomerService: BranchCustomerService,
    private customerService: CustomerService,
    private branchService: BranchService
  ) {}

  // Create Branch Customer API
  /**
   * @api {post} /api/branch-customer/create-branch-customer Create Branch Customer API
   * @apiGroup Branch Customer
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerId customerId
   * @apiParam (Request body) {Number} isHome isHome
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "isHome" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Customer is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-customer/create-branch-customer
   * @apiErrorExample {json} createBranchCustomer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-customer")
  @Authorized()
  public async createBranchCustomer(
    @Body({ validate: true }) createBranchCustomerParam: CreateBranchCustomerRequest,
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
    const newBranchCustomer: any = new BranchCustomer();
    newBranchCustomer.branchId = createBranchCustomerParam.branchId;
    newBranchCustomer.customerId = createBranchCustomerParam.customerId;
    newBranchCustomer.isHome = createBranchCustomerParam.isHome;
    newBranchCustomer.isActive = createBranchCustomerParam.status;
    const branchCustomerSave = await this.branchCustomerService.create(newBranchCustomer);
    if (branchCustomerSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Customer saved successfully",
        data: branchCustomerSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Customer",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Customer API
  /**
   * @api {put} /api/branch-customer/update-branch-customer/:id Update Branch Customer API
   * @apiGroup Branch Customer
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerId customerId
   * @apiParam (Request body) {Number} isHome isHome
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "customerId" : "",
   *      "isHome" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Customer is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-customer/update-branch-customer/:id
   * @apiErrorExample {json} updateBranchCustomer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-customer/:id")
  @Authorized()
  public async updateBranchCustomer(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchCustomerParam: CreateBranchCustomerRequest,
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
    const branchCustomer = await this.branchCustomerService.findOne({
      where: {
        branchCustomerId: id,
      },
    });
    console.log(branchCustomer);
    if (!branchCustomer) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchCustomerId",
      };
      return response.status(400).send(errorResponse);
    }
    branchCustomer.branchId = createBranchCustomerParam.branchId;
    branchCustomer.customerId = createBranchCustomerParam.customerId;
    branchCustomer.isHome = createBranchCustomerParam.isHome;
    branchCustomer.isActive = createBranchCustomerParam.status;
    const branchCustomerUpdate = await this.branchCustomerService.update(
      id,
      branchCustomer
    );
    if (branchCustomerUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Customer updated successfully",
        data: branchCustomerUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Customer",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Customer List API
  /**
   * @api {get} /api/branch-customer/branch-customer-list Branch Customer List API
   * @apiGroup Branch Customer
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerId customerId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Customer list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-customer/branch-customer-list
   * @apiErrorExample {json} branch Customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-customer-list")
  @Authorized()
  public async branchCustomerList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("customerId") customerId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "customerId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "customerId",
        op: "where",
        value: customerId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchCustomerList = await this.branchCustomerService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bCustomer = val.map(async (value: any) => {
          const temp: any = value;
          const customer = await this.customerService.findOne({
            where: { customerId: temp.customerId },
          });
          temp.customerName = customer.name;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bCustomer);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchCustomer List",
      data: branchCustomerList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Customer API
  /**
   * @api {delete} /api/branch-customer/delete-branch-customer/:id Delete Branch Customer API
   * @apiGroup Branch Customer
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch customer.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-customer/delete-branch-customer/:id
   * @apiErrorExample {json} Branch Customer error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-customer/:id")
  @Authorized()
  public async deleteBranchCustomer(
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
    const branchCustomerId = await this.branchCustomerService.findOne({
      where: {
        branchCustomerId: id,
      },
    });
    if (!branchCustomerId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchCustomerId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchCustomer = await this.branchCustomerService.delete(id);
    console.log("branchCustomer" + branchCustomer);
    if (branchCustomer) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch customer",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch customer",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
