import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { CityRepository } from "../repositories/CityRepository";
import { City } from "../models/City";

@Service()
export class CityService {
  constructor(
    @OrmRepository() private cityRepository: CityRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create city
  public async create(city: any): Promise<City> {
    this.log.info("Create a new city ");
    return this.cityRepository.save(city);
  }

  // find Condition
  public findOne(city: any): Promise<any> {
    return this.cityRepository.findOne(city);
  }

  // update city
  public update(id: any, city: City): Promise<any> {
    city.cityId = id;
    return this.cityRepository.save(city);
  }

  // city List
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
      return this.cityRepository.count(condition);
    } else {
      return this.cityRepository.find(condition);
    }
  }
  // delete City
  public async delete(id: number): Promise<any> {
    return await this.cityRepository.delete(id);
  }
}
