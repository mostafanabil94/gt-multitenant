import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchAdminRepository } from "../repositories/BranchAdminRepository";
import { BranchAdmin } from "../models/BranchAdmin";

@Service()
export class BranchAdminService {
  constructor(
    @OrmRepository() private branchAdminRepository: BranchAdminRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branch admin
  public async create(branchAdmin: any): Promise<BranchAdmin> {
    this.log.info("Create a new Branch Admin ");
    return this.branchAdminRepository.save(branchAdmin);
  }

  // find Condition
  public findOne(branchAdmin: any): Promise<any> {
    return this.branchAdminRepository.findOne(branchAdmin);
  }

  // update branch admin
  public update(id: any, branchAdmin: BranchAdmin): Promise<any> {
    branchAdmin.branchAdminId = id;
    return this.branchAdminRepository.save(branchAdmin);
  }

  // branch admin List
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
      return this.branchAdminRepository.count(condition);
    } else {
      return this.branchAdminRepository.find(condition);
    }
  }
  // delete branch admin
  public async delete(id: number): Promise<any> {
    return await this.branchAdminRepository.delete(id);
  }
}
