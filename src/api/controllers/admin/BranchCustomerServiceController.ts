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
import { CreateBranchCustomerServiceRequest } from "./requests/CreateBranchCustomerServiceRequest";
import { BranchCustomerService } from "../../models/BranchCustomerService";
import { BranchCustomerServiceService } from "../../services/BranchCustomerServiceService";
import { CustomerServiceService } from "../../services/CustomerServiceService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-customer-service")
export class BranchCustomerServiceController {
  constructor(
    private branchCustomerServiceService: BranchCustomerServiceService,
    private customerServiceService: CustomerServiceService,
    private branchService: BranchService
  ) {}

  // Create Branch CustomerService API
  /**
   * @api {post} /api/branch-customer-service/create-branch-customer-service Create Branch CustomerService API
   * @apiGroup Branch CustomerService
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerServiceId customerServiceId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "customerServiceId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch CustomerService is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-customer-service/create-branch-customer-service
   * @apiErrorExample {json} createBranchCustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-customer-service")
  @Authorized()
  public async createBranchCustomerService(
    @Body({ validate: true }) createBranchCustomerServiceParam: CreateBranchCustomerServiceRequest,
    @Res() response: any
  ): Promise<any> {
    const newBranchCustomerService: any = new BranchCustomerService();
    newBranchCustomerService.branchId = createBranchCustomerServiceParam.branchId;
    newBranchCustomerService.customerServiceId = createBranchCustomerServiceParam.customerServiceId;
    newBranchCustomerService.isActive = createBranchCustomerServiceParam.status;
    const branchCustomerServiceSave = await this.branchCustomerServiceService.create(newBranchCustomerService);
    if (branchCustomerServiceSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch CustomerService saved successfully",
        data: branchCustomerServiceSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch CustomerService",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch CustomerService API
  /**
   * @api {put} /api/branch-customer-service/update-branch-customer-service/:id Update Branch CustomerService API
   * @apiGroup Branch CustomerService
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerServiceId customerServiceId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "customerServiceId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch CustomerService is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-customer-service/update-branch-customer-service/:id
   * @apiErrorExample {json} updateBranchCustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-customer-service/:id")
  @Authorized()
  public async updateBranchCustomerService(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchCustomerServiceParam: CreateBranchCustomerServiceRequest,
    @Res() response: any
  ): Promise<any> {
    const branchCustomerService = await this.branchCustomerServiceService.findOne({
      where: {
        branchCustomerServiceId: id,
      },
    });
    console.log(branchCustomerService);
    if (!branchCustomerService) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchCustomerServiceId",
      };
      return response.status(400).send(errorResponse);
    }
    branchCustomerService.branchId = createBranchCustomerServiceParam.branchId;
    branchCustomerService.customerServiceId = createBranchCustomerServiceParam.customerServiceId;
    branchCustomerService.isActive = createBranchCustomerServiceParam.status;
    const branchCustomerServiceUpdate = await this.branchCustomerServiceService.update(
      id,
      branchCustomerService
    );
    if (branchCustomerServiceUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch CustomerService updated successfully",
        data: branchCustomerServiceUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch CustomerService",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch CustomerService List API
  /**
   * @api {get} /api/branch-customer-service/branch-customer-service-list Branch CustomerService List API
   * @apiGroup Branch CustomerService
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} customerServiceId customerServiceId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch CustomerService list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-customer-service/branch-customer-service-list
   * @apiErrorExample {json} branch CustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-customer-service-list")
  @Authorized()
  public async branchCustomerServiceList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("customerServiceId") customerServiceId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "customerServiceId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "customerServiceId",
        op: "where",
        value: customerServiceId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchCustomerServiceList = await this.branchCustomerServiceService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bCustomerService = val.map(async (value: any) => {
          const temp: any = value;
          const customerService = await this.customerServiceService.findOne({
            where: { customerServiceId: temp.customerServiceId },
          });
          temp.customerServiceName = customerService.firstName + ' ' + customerService.lastName;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bCustomerService);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchCustomerService List",
      data: branchCustomerServiceList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch CustomerService API
  /**
   * @api {delete} /api/branch-customer-service/delete-branch-customer-service/:id Delete Branch CustomerService API
   * @apiGroup Branch CustomerService
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch customerService.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-customer-service/delete-branch-customer-service/:id
   * @apiErrorExample {json} Branch CustomerService error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-customer-service/:id")
  @Authorized()
  public async deleteBranchCustomerService(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const branchCustomerServiceId = await this.branchCustomerServiceService.findOne({
      where: {
        branchCustomerServiceId: id,
      },
    });
    if (!branchCustomerServiceId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchCustomerServiceId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchCustomerService = await this.branchCustomerServiceService.delete(id);
    console.log("branchCustomerService" + branchCustomerService);
    if (branchCustomerService) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch customerService",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch customerService",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
