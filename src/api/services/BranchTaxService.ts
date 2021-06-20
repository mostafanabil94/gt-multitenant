import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchTaxRepository } from "../repositories/BranchTaxRepository";
import { BranchTax } from "../models/BranchTax";

@Service()
export class BranchTaxService {
  constructor(
    @OrmRepository() private branchTaxRepository: BranchTaxRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchTax
  public async create(branchTax: any): Promise<BranchTax> {
    this.log.info("Create a new Branch Tax ");
    return this.branchTaxRepository.save(branchTax);
  }

  // find Condition
  public findOne(branchTax: any): Promise<any> {
    return this.branchTaxRepository.findOne(branchTax);
  }

  // update branchTax
  public update(id: any, branchTax: BranchTax): Promise<any> {
    branchTax.branchTaxId = id;
    return this.branchTaxRepository.save(branchTax);
  }

  // branchTax List
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
      return this.branchTaxRepository.count(condition);
    } else {
      return this.branchTaxRepository.find(condition);
    }
  }
  // delete branchTax
  public async delete(id: number): Promise<any> {
    return await this.branchTaxRepository.delete(id);
  }
}
