import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { ClientMembershipPlanRepository } from "../repositories/ClientMembershipPlanRepository";
import { ClientMembershipPlan } from "../models/ClientMembershipPlan";

@Service()
export class ClientMembershipPlanService {
  constructor(
    @OrmRepository() private clientMembershipPlanRepository: ClientMembershipPlanRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create clientMembershipPlan
  public async create(clientMembershipPlan: any): Promise<ClientMembershipPlan> {
    this.log.info("Create a new Client Membership Plan ");
    return this.clientMembershipPlanRepository.save(clientMembershipPlan);
  }

  // find Condition
  public findOne(clientMembershipPlan: any): Promise<any> {
    return this.clientMembershipPlanRepository.findOne(clientMembershipPlan);
  }

  // update clientMembershipPlan
  public update(id: any, clientMembershipPlan: ClientMembershipPlan): Promise<any> {
    clientMembershipPlan.clientMembershipPlanId = id;
    return this.clientMembershipPlanRepository.save(clientMembershipPlan);
  }

  // clientMembershipPlan List
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
      return this.clientMembershipPlanRepository.count(condition);
    } else {
      return this.clientMembershipPlanRepository.find(condition);
    }
  }
  // delete clientMembershipPlan
  public async delete(id: number): Promise<any> {
    return await this.clientMembershipPlanRepository.delete(id);
  }
}
