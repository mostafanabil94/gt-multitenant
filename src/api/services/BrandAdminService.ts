import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BrandAdminRepository } from "../repositories/BrandAdminRepository";
import { BrandAdmin } from "../models/BrandAdmin";

@Service()
export class BrandAdminService {
  constructor(
    @OrmRepository() private brandAdminRepository: BrandAdminRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create brand admin
  public async create(brandAdmin: any): Promise<BrandAdmin> {
    this.log.info("Create a new Brand Admin ");
    return this.brandAdminRepository.save(brandAdmin);
  }

  // find Condition
  public findOne(brandAdmin: any): Promise<any> {
    return this.brandAdminRepository.findOne(brandAdmin);
  }

  // update brand admin
  public update(id: any, brandAdmin: BrandAdmin): Promise<any> {
    brandAdmin.brandAdminId = id;
    return this.brandAdminRepository.save(brandAdmin);
  }

  // brand admin List
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
      return this.brandAdminRepository.count(condition);
    } else {
      return this.brandAdminRepository.find(condition);
    }
  }
  // delete brand admin
  public async delete(id: number): Promise<any> {
    return await this.brandAdminRepository.delete(id);
  }
}
