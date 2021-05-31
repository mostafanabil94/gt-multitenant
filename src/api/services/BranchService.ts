import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchRepository } from "../repositories/BranchRepository";
import { Branch } from "../models/Branch";

@Service()
export class BranchService {
  constructor(
    @OrmRepository() private branchRepository: BranchRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branch
  public async create(branch: any): Promise<Branch> {
    this.log.info("Create a new Branch ");
    return this.branchRepository.save(branch);
  }

  // find Condition
  public findOne(branch: any): Promise<any> {
    return this.branchRepository.findOne(branch);
  }

  // update branch
  public update(id: any, branch: Branch): Promise<any> {
    branch.branchId = id;
    return this.branchRepository.save(branch);
  }

  // branch List
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
      return this.branchRepository.count(condition);
    } else {
      return this.branchRepository.find(condition);
    }
  }
  // delete branch
  public async delete(id: number): Promise<any> {
    return await this.branchRepository.delete(id);
  }
}
