import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchMembershipRepository } from "../repositories/BranchMembershipRepository";
import { BranchMembership } from "../models/BranchMembership";

@Service()
export class BranchMembershipService {
  constructor(
    @OrmRepository() private branchMembershipRepository: BranchMembershipRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchMembership
  public async create(branchMembership: any): Promise<BranchMembership> {
    this.log.info("Create a new Branch Membership ");
    return this.branchMembershipRepository.save(branchMembership);
  }

  // find Condition
  public findOne(branchMembership: any): Promise<any> {
    return this.branchMembershipRepository.findOne(branchMembership);
  }

  // update branchMembership
  public update(id: any, branchMembership: BranchMembership): Promise<any> {
    branchMembership.branchMembershipId = id;
    return this.branchMembershipRepository.save(branchMembership);
  }

  // branchMembership List
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
      return this.branchMembershipRepository.count(condition);
    } else {
      return this.branchMembershipRepository.find(condition);
    }
  }
  // delete branchMembership
  public async delete(id: number): Promise<any> {
    return await this.branchMembershipRepository.delete(id);
  }
}
