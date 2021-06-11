import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { MembershipPlanRepository } from "../repositories/MembershipPlanRepository";
import { MembershipPlan } from "../models/MembershipPlan";

@Service()
export class MembershipPlanService {
  constructor(
    @OrmRepository() private membershipPlanRepository: MembershipPlanRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create membership plan
  public async create(membershipPlan: any): Promise<MembershipPlan> {
    this.log.info("Create a new Membership Plan ");
    return this.membershipPlanRepository.save(membershipPlan);
  }

  // find Condition
  public findOne(membershipPlan: any): Promise<any> {
    return this.membershipPlanRepository.findOne(membershipPlan);
  }

  // update membership plan
  public update(id: any, membershipPlan: MembershipPlan): Promise<any> {
    membershipPlan.membershipPlanId = id;
    return this.membershipPlanRepository.save(membershipPlan);
  }

  // membership plan List
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
      return this.membershipPlanRepository.count(condition);
    } else {
      return this.membershipPlanRepository.find(condition);
    }
  }
  // delete membership plan
  public async delete(id: number): Promise<any> {
    return await this.membershipPlanRepository.delete(id);
  }
}
