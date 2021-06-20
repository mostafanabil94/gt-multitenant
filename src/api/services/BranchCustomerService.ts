import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchCustomerRepository } from "../repositories/BranchCustomerRepository";
import { BranchCustomer } from "../models/BranchCustomer";

@Service()
export class BranchCustomerService {
  constructor(
    @OrmRepository() private branchCustomerRepository: BranchCustomerRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchCustomer
  public async create(branchCustomer: any): Promise<BranchCustomer> {
    this.log.info("Create a new Branch Customer ");
    return this.branchCustomerRepository.save(branchCustomer);
  }

  // find Condition
  public findOne(branchCustomer: any): Promise<any> {
    return this.branchCustomerRepository.findOne(branchCustomer);
  }

  // update branchCustomer
  public update(id: any, branchCustomer: BranchCustomer): Promise<any> {
    branchCustomer.branchCustomerId = id;
    return this.branchCustomerRepository.save(branchCustomer);
  }

  // branchCustomer List
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
      return this.branchCustomerRepository.count(condition);
    } else {
      return this.branchCustomerRepository.find(condition);
    }
  }
  // delete branchCustomer
  public async delete(id: number): Promise<any> {
    return await this.branchCustomerRepository.delete(id);
  }
}
