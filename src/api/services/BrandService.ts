import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BrandRepository } from "../repositories/BrandRepository";
import { Brand } from "../models/Brand";

@Service()
export class BrandService {
  constructor(
    @OrmRepository() private brandRepository: BrandRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create brand
  public async create(brand: any): Promise<Brand> {
    this.log.info("Create a new Brand ");
    return this.brandRepository.save(brand);
  }

  // find Condition
  public findOne(brand: any): Promise<any> {
    return this.brandRepository.findOne(brand);
  }

  // update brand
  public update(id: any, brand: Brand): Promise<any> {
    brand.brandId = id;
    return this.brandRepository.save(brand);
  }

  // brand List
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
      return this.brandRepository.count(condition);
    } else {
      return this.brandRepository.find(condition);
    }
  }
  // delete brand
  public async delete(id: number): Promise<any> {
    return await this.brandRepository.delete(id);
  }
}
