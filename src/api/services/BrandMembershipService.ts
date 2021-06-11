import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BrandMembershipRepository } from "../repositories/BrandMembershipRepository";
import { BrandMembership } from "../models/BrandMembership";

@Service()
export class BrandMembershipService {
  constructor(
    @OrmRepository() private brandMembershipRepository: BrandMembershipRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create brandMembership
  public async create(brandMembership: any): Promise<BrandMembership> {
    this.log.info("Create a new Brand Membership ");
    return this.brandMembershipRepository.save(brandMembership);
  }

  // find Condition
  public findOne(brandMembership: any): Promise<any> {
    return this.brandMembershipRepository.findOne(brandMembership);
  }

  // update brandMembership
  public update(id: any, brandMembership: BrandMembership): Promise<any> {
    brandMembership.brandMembershipId = id;
    return this.brandMembershipRepository.save(brandMembership);
  }

  // brandMembership List
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
      return this.brandMembershipRepository.count(condition);
    } else {
      return this.brandMembershipRepository.find(condition);
    }
  }
  // delete brandMembership
  public async delete(id: number): Promise<any> {
    return await this.brandMembershipRepository.delete(id);
  }
}
