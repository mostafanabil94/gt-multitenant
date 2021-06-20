import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BrandUserRepository } from "../repositories/BrandUserRepository";
import { BrandUser } from "../models/BrandUser";

@Service()
export class BrandUserService {
  constructor(
    @OrmRepository() private brandUserRepository: BrandUserRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create brand user
  public async create(brandUser: any): Promise<BrandUser> {
    this.log.info("Create a new Brand User ");
    return this.brandUserRepository.save(brandUser);
  }

  // find Condition
  public findOne(brandUser: any): Promise<any> {
    return this.brandUserRepository.findOne(brandUser);
  }

  // update brand user
  public update(id: any, brandUser: BrandUser): Promise<any> {
    brandUser.brandUserId = id;
    return this.brandUserRepository.save(brandUser);
  }

  // brand user List
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
      return this.brandUserRepository.count(condition);
    } else {
      return this.brandUserRepository.find(condition);
    }
  }
  // delete brand user
  public async delete(id: number): Promise<any> {
    return await this.brandUserRepository.delete(id);
  }
}
