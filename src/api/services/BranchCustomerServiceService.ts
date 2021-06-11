import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchCustomerServiceRepository } from "../repositories/BranchCustomerServiceRepository";
import { BranchCustomerService } from "../models/BranchCustomerService";

@Service()
export class BranchCustomerServiceService {
  constructor(
    @OrmRepository() private branchCustomerServiceRepository: BranchCustomerServiceRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchCustomerService
  public async create(branchCustomerService: any): Promise<BranchCustomerService> {
    this.log.info("Create a new Brand Membership ");
    return this.branchCustomerServiceRepository.save(branchCustomerService);
  }

  // find Condition
  public findOne(branchCustomerService: any): Promise<any> {
    return this.branchCustomerServiceRepository.findOne(branchCustomerService);
  }

  // update branchCustomerService
  public update(id: any, branchCustomerService: BranchCustomerService): Promise<any> {
    branchCustomerService.branchCustomerServiceId = id;
    return this.branchCustomerServiceRepository.save(branchCustomerService);
  }

  // branchCustomerService List
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
      return this.branchCustomerServiceRepository.count(condition);
    } else {
      return this.branchCustomerServiceRepository.find(condition);
    }
  }
  // delete branchCustomerService
  public async delete(id: number): Promise<any> {
    return await this.branchCustomerServiceRepository.delete(id);
  }
}
