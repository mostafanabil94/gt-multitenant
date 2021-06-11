import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchSalesRepository } from "../repositories/BranchSalesRepository";
import { BranchSales } from "../models/BranchSales";

@Service()
export class BranchSalesService {
  constructor(
    @OrmRepository() private branchSalesRepository: BranchSalesRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchSales
  public async create(branchSales: any): Promise<BranchSales> {
    this.log.info("Create a new Branch Sales ");
    return this.branchSalesRepository.save(branchSales);
  }

  // find Condition
  public findOne(branchSales: any): Promise<any> {
    return this.branchSalesRepository.findOne(branchSales);
  }

  // update branchSales
  public update(id: any, branchSales: BranchSales): Promise<any> {
    branchSales.branchSalesId = id;
    return this.branchSalesRepository.save(branchSales);
  }

  // branchSales List
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
      return this.branchSalesRepository.count(condition);
    } else {
      return this.branchSalesRepository.find(condition);
    }
  }
  // delete branchSales
  public async delete(id: number): Promise<any> {
    return await this.branchSalesRepository.delete(id);
  }
}
