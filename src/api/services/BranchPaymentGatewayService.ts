import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchPaymentGatewayRepository } from "../repositories/BranchPaymentGatewayRepository";
import { BranchPaymentGateway } from "../models/BranchPaymentGateway";

@Service()
export class BranchPaymentGatewayService {
  constructor(
    @OrmRepository() private branchPaymentGatewayRepository: BranchPaymentGatewayRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchPaymentGateway
  public async create(branchPaymentGateway: any): Promise<BranchPaymentGateway> {
    this.log.info("Create a new Payment Gateway ");
    return this.branchPaymentGatewayRepository.save(branchPaymentGateway);
  }

  // find Condition
  public findOne(branchPaymentGateway: any): Promise<any> {
    return this.branchPaymentGatewayRepository.findOne(branchPaymentGateway);
  }

  // update branchPaymentGateway
  public update(id: any, branchPaymentGateway: BranchPaymentGateway): Promise<any> {
    branchPaymentGateway.branchPaymentGatewayId = id;
    return this.branchPaymentGatewayRepository.save(branchPaymentGateway);
  }

  // branchPaymentGateway List
  public list(
    limit: any,
    offset: any,
    select: any = [],
    search: any = [],
    whereConditions: any = [],
    relation: any = [],
    count: number | boolean
  ): Promise<any> {
    const condition: any = {};

    if (select && select.length > 0) {
      condition.select = select;
    }
    condition.where = {};

    if (relation && relation.length > 0) {
      condition.relations = relation;
    }

    if (whereConditions && whereConditions.length > 0) {
      whereConditions.forEach((item: any) => {
        condition.where[item.name] = item.value;
      });
    }

    if (search && search.length > 0) {
      search.forEach((table: any) => {
        const operator: string = table.op;
        if (operator === "where" && table.value !== "") {
          condition.where[table.name] = table.value;
        } else if (operator === "like" && table.value !== "") {
          condition.where[table.name] = Like("%" + table.value + "%");
        }
      });
    }

    if (limit && limit > 0) {
      condition.take = limit;
      condition.skip = offset;
    }

    if (count) {
      return this.branchPaymentGatewayRepository.count(condition);
    } else {
      return this.branchPaymentGatewayRepository.find(condition);
    }
  }
  // delete branchPaymentGateway
  public async delete(id: number): Promise<any> {
    return await this.branchPaymentGatewayRepository.delete(id);
  }
}
