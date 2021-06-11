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
import { CreateBranchFitnessRequest } from "./requests/CreateBranchFitnessRequest";
import { BranchFitness } from "../../models/BranchFitness";
import { BranchFitnessService } from "../../services/BranchFitnessService";
import { FitnessService } from "../../services/FitnessService";
import { BranchService } from "../../services/BranchService";

@JsonController("/branch-fitness")
export class BranchFitnessController {
  constructor(
    private branchFitnessService: BranchFitnessService,
    private fitnessService: FitnessService,
    private branchService: BranchService
  ) {}

  // Create Branch Fitness API
  /**
   * @api {post} /api/branch-fitness/create-branch-fitness Create Branch Fitness API
   * @apiGroup Branch Fitness
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} fitnessId fitnessId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "fitnessId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Branch Fitness is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-fitness/create-branch-fitness
   * @apiErrorExample {json} createBranchFitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-branch-fitness")
  @Authorized()
  public async createBranchFitness(
    @Body({ validate: true }) createBranchFitnessParam: CreateBranchFitnessRequest,
    @Res() response: any
  ): Promise<any> {
    const newBranchFitness: any = new BranchFitness();
    newBranchFitness.branchId = createBranchFitnessParam.branchId;
    newBranchFitness.fitnessId = createBranchFitnessParam.fitnessId;
    newBranchFitness.isActive = createBranchFitnessParam.status;
    const branchFitnessSave = await this.branchFitnessService.create(newBranchFitness);
    if (branchFitnessSave) {
      const successResponse: any = {
        status: 1,
        message: "Branch Fitness saved successfully",
        data: branchFitnessSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Branch Fitness",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Branch Fitness API
  /**
   * @api {put} /api/branch-fitness/update-branch-fitness/:id Update Branch Fitness API
   * @apiGroup Branch Fitness
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} fitnessId fitnessId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "fitnessId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Branch Fitness is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-fitness/update-branch-fitness/:id
   * @apiErrorExample {json} updateBranchFitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-branch-fitness/:id")
  @Authorized()
  public async updateBranchFitness(
    @Param("id") id: number,
    @Body({ validate: true }) createBranchFitnessParam: CreateBranchFitnessRequest,
    @Res() response: any
  ): Promise<any> {
    const branchFitness = await this.branchFitnessService.findOne({
      where: {
        branchFitnessId: id,
      },
    });
    console.log(branchFitness);
    if (!branchFitness) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchFitnessId",
      };
      return response.status(400).send(errorResponse);
    }
    branchFitness.branchId = createBranchFitnessParam.branchId;
    branchFitness.fitnessId = createBranchFitnessParam.fitnessId;
    branchFitness.isActive = createBranchFitnessParam.status;
    const branchFitnessUpdate = await this.branchFitnessService.update(
      id,
      branchFitness
    );
    if (branchFitnessUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Branch Fitness updated successfully",
        data: branchFitnessUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Branch Fitness",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Branch Fitness List API
  /**
   * @api {get} /api/branch-fitness/branch-fitness-list Branch Fitness List API
   * @apiGroup Branch Fitness
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} fitnessId fitnessId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Branch Fitness list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/branch-fitness/branch-fitness-list
   * @apiErrorExample {json} branch Fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/branch-fitness-list")
  @Authorized()
  public async branchFitnessList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("fitnessId") fitnessId: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "fitnessId", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "fitnessId",
        op: "where",
        value: fitnessId,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const branchFitnessList = await this.branchFitnessService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const bFitness = val.map(async (value: any) => {
          const temp: any = value;
          const fitness = await this.fitnessService.findOne({
            where: { fitnessId: temp.fitnessId },
          });
          temp.fitnessName = fitness.firstName + ' ' + fitness.lastName;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(bFitness);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all branchFitness List",
      data: branchFitnessList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Branch Fitness API
  /**
   * @api {delete} /api/branch-fitness/delete-branch-fitness/:id Delete Branch Fitness API
   * @apiGroup Branch Fitness
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted branch fitness.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/branch-fitness/delete-branch-fitness/:id
   * @apiErrorExample {json} Branch Fitness error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-branch-fitness/:id")
  @Authorized()
  public async deleteBranchFitness(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const branchFitnessId = await this.branchFitnessService.findOne({
      where: {
        branchFitnessId: id,
      },
    });
    if (!branchFitnessId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid branchFitnessId",
      };
      return response.status(400).send(errorResponse);
    }

    const branchFitness = await this.branchFitnessService.delete(id);
    console.log("branchFitness" + branchFitness);
    if (branchFitness) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted branch fitness",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete branch fitness",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
