import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchCurrencyRepository } from "../repositories/BranchCurrencyRepository";
import { BranchCurrency } from "../models/BranchCurrency";

@Service()
export class BranchCurrencyService {
  constructor(
    @OrmRepository() private branchCurrencyRepository: BranchCurrencyRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchCurrency
  public async create(branchCurrency: any): Promise<BranchCurrency> {
    this.log.info("Create a new Branch Currency ");
    return this.branchCurrencyRepository.save(branchCurrency);
  }

  // find Condition
  public findOne(branchCurrency: any): Promise<any> {
    return this.branchCurrencyRepository.findOne(branchCurrency);
  }

  // update branchCurrency
  public update(id: any, branchCurrency: BranchCurrency): Promise<any> {
    branchCurrency.branchCurrencyId = id;
    return this.branchCurrencyRepository.save(branchCurrency);
  }

  // branchCurrency List
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
      return this.branchCurrencyRepository.count(condition);
    } else {
      return this.branchCurrencyRepository.find(condition);
    }
  }
  // delete branchCurrency
  public async delete(id: number): Promise<any> {
    return await this.branchCurrencyRepository.delete(id);
  }
}
