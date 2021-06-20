import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchUserRepository } from "../repositories/BranchUserRepository";
import { BranchUser } from "../models/BranchUser";

@Service()
export class BranchUserService {
  constructor(
    @OrmRepository() private branchUserRepository: BranchUserRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branch user
  public async create(branchUser: any): Promise<BranchUser> {
    this.log.info("Create a new Branch User ");
    return this.branchUserRepository.save(branchUser);
  }

  // find Condition
  public findOne(branchUser: any): Promise<any> {
    return this.branchUserRepository.findOne(branchUser);
  }

  // update branch user
  public update(id: any, branchUser: BranchUser): Promise<any> {
    branchUser.branchUserId = id;
    return this.branchUserRepository.save(branchUser);
  }

  // branch user List
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
      return this.branchUserRepository.count(condition);
    } else {
      return this.branchUserRepository.find(condition);
    }
  }
  // delete branch user
  public async delete(id: number): Promise<any> {
    return await this.branchUserRepository.delete(id);
  }
}
