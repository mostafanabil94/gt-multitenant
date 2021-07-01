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
import { CreateBranchPaymentGatewayRequest } from "./requests/CreateBranchPaymentGatewayRequest";
import { BranchPaymentGateway } from "../../models/BranchPaymentGateway";
import { BranchPaymentGatewayService } from "../../services/BranchPaymentGatewayService";
import { PaymentGatewayService } from "../../services/PaymentGatewayService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-payment-gateway")
export class BranchPaymentGatewayController {
  constructor(
    private branchPaymentGatewayService: BranchPaymentGatewayService,
    private paymentGatewayService: PaymentGatewayService,
    private branchService: BranchService
  ) {}

  // Create Branch PaymentGateway API
  /**
   * @api {post} /api/branch-payment-gateway/create-branch-payment-gateway Create Branch PaymentGateway API
   * @apiGroup Branch Payment Gateway
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} paymentGatewayId paymentGatewayId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "paymentGatewayId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Payment Gateway is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-payment-gateway/create-branch-payment-gateway
   * @apiErrorExample {json} Create Branch Payment Gateway error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-payment-gateway")
  @Authorized()
  public async createBranchPaymentGateway(
    @Body({ validate: true }) createBranchPaymentGatewayParam: CreateBranchPaymentGatewayRequest,
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
    const newBranchPaymentGateway: any = new BranchPaymentGateway();
    newBranchPaymentGateway.branchId = createBranchPaymentGatewayParam.branchId;
    newBranchPaymentGateway.paymentGatewayId = createBranchPaymentGatewayParam.paymentGatewayId;
    newBranchPaymentGateway.paymentGatewayData = createBranchPaymentGatewayParam.paymentGatewayData;
    newBranchPaymentGateway.isActive = createBranchPaymentGatewayParam.status;
    const branchPaymentGatewaySave = await this.branchPaymentGatewayService.create(newBranchPaymentGateway);
    if (branchPaymentGatewaySave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Payment Gateway saved successfully",
        data: branchPaymentGatewaySave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Payment Gateway",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Payment Gateway API
  /**
   * @api {put} /api/branch-payment-gateway/update-branch-payment-gateway/:id Update Branch Payment Gateway API
   * @apiGroup Branch Payment Gateway
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} paymentGatewayId paymentGatewayId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "paymentGatewayId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Payment Gateway is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-payment-gateway/update-branch-payment-gateway/:id
   * @apiErrorExample {json} Update Branch Payment Gateway error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-payment-gateway/:id")
  @Authorized()
  public async updateBranchPaymentGateway(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchPaymentGatewayParam: CreateBranchPaymentGatewayRequest,
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
    const branchPaymentGateway = await this.branchPaymentGatewayService.findOne({
      where: {
        branchPaymentGatewayId: id,
      },
    });
    console.log(branchPaymentGateway);
    if (!branchPaymentGateway) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid Branch Payment Gateway Id",
      };
      return response.status(400).send(errorResponse);
    }
    branchPaymentGateway.branchId = createBranchPaymentGatewayParam.branchId;
    branchPaymentGateway.paymentGatewayId = createBranchPaymentGatewayParam.paymentGatewayId;
    branchPaymentGateway.paymentGatewayData = createBranchPaymentGatewayParam.paymentGatewayData;
    branchPaymentGateway.isActive = createBranchPaymentGatewayParam.status;
    const branchPaymentGatewayUpdate = await this.branchPaymentGatewayService.update(
      id,
      branchPaymentGateway
    );
    if (branchPaymentGatewayUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Payment Gateway updated successfully",
        data: branchPaymentGatewayUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to Update Branch Payment Gateway",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Payment Gateway List API
  /**
   * @api {get} /api/branch-payment-gateway/branch-payment-gateway-list Branch Payment Gateway List API
   * @apiGroup Branch Payment Gateway
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} paymentGatewayId paymentGatewayId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Payment Gateway list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-payment-gateway/branch-payment-gateway-list
   * @apiErrorExample {json} Branch Payment Gateway error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-payment-gateway-list")
  @Authorized()
  public async branchPaymentGatewayList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("paymentGatewayId") paymentGatewayId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "paymentGatewayId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "paymentGatewayId",
        op: "where",
        value: paymentGatewayId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchPaymentGatewayList = await this.branchPaymentGatewayService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bPaymentGateway = val.map(async (value: any) => {
          const temp: any = value;
          const paymentGateway = await this.paymentGatewayService.findOne({
              select: ['paymentGatewayId', 'name'],
            where: { paymentGatewayId: temp.paymentGatewayId },
          });
          temp.paymentGatewayName = paymentGateway.name;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bPaymentGateway);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all Branch Payment Gateway List",
      data: branchPaymentGatewayList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Payment Gateway API
  /**
   * @api {delete} /api/branch-payment-gateway/delete-branch-payment-gateway/:id Delete Branch Payment Gateway API
   * @apiGroup Branch Payment Gateway
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch payment gateway.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-payment-gateway/delete-branch-payment-gateway/:id
   * @apiErrorExample {json} Delete Branch Payment Gateway error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-payment-gateway/:id")
  @Authorized()
  public async deleteBranchPaymentGateway(
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
    const branchPaymentGatewayId = await this.branchPaymentGatewayService.findOne({
      where: {
        branchPaymentGatewayId: id,
      },
    });
    if (!branchPaymentGatewayId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid Branch Payment Gateway Id",
      };
      return response.status(400).send(errorResponse);
    }

    const branchPaymentGateway = await this.branchPaymentGatewayService.delete(id);
    console.log("branchPaymentGateway" + branchPaymentGateway);
    if (branchPaymentGateway) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch payment gateway",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch payment gateway",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
