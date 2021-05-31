import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { FitnessRepository } from "../repositories/FitnessRepository";

@Service()
export class FitnessService {
  constructor(
    @OrmRepository() private fitnessRepository: FitnessRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create fitness
  public async create(fitness: any): Promise<any> {
    this.log.info("Create a new fitness ");
    return this.fitnessRepository.save(fitness);
  }

  // find Condition
  public findOne(fitness: any): Promise<any> {
    return this.fitnessRepository.findOne(fitness);
  }

  // find Condition
  public findAll(): Promise<any> {
    return this.fitnessRepository.find();
  }

  // update fitness
  public update(id: any, fitness: any): Promise<any> {
    fitness.fitnessId = id;
    return this.fitnessRepository.save(fitness);
  }
  // fitness List
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
      return this.fitnessRepository.count(condition);
    } else {
      return this.fitnessRepository.find(condition);
    }
  }
  // delete fitness
  public async delete(id: number): Promise<any> {
    return await this.fitnessRepository.delete(id);
  }
  // today fitness count
  public async todayFitnessCount(todaydate: string): Promise<any> {
    return await this.fitnessRepository.TodayFitnessCount(todaydate);
  }
}
