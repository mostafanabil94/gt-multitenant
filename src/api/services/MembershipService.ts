import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { Membership } from "../models/Membership";

@Service()
export class MembershipService {
  constructor(
    @OrmRepository() private membershipRepository: MembershipRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create membership
  public async create(membership: any): Promise<Membership> {
    this.log.info("Create a new Membership ");
    return this.membershipRepository.save(membership);
  }

  // find Condition
  public findOne(membership: any): Promise<any> {
    return this.membershipRepository.findOne(membership);
  }

  // update membership
  public update(id: any, membership: Membership): Promise<any> {
    membership.membershipId = id;
    return this.membershipRepository.save(membership);
  }

  // membership List
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
      return this.membershipRepository.count(condition);
    } else {
      return this.membershipRepository.find(condition);
    }
  }
  // delete membership
  public async delete(id: number): Promise<any> {
    return await this.membershipRepository.delete(id);
  }
}
