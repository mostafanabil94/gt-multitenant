import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { BranchFitnessRepository } from "../repositories/BranchFitnessRepository";
import { BranchFitness } from "../models/BranchFitness";

@Service()
export class BranchFitnessService {
  constructor(
    @OrmRepository() private branchFitnessRepository: BranchFitnessRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create branchFitness
  public async create(branchFitness: any): Promise<BranchFitness> {
    this.log.info("Create a new Branch Fitness ");
    return this.branchFitnessRepository.save(branchFitness);
  }

  // find Condition
  public findOne(branchFitness: any): Promise<any> {
    return this.branchFitnessRepository.findOne(branchFitness);
  }

  // update branchFitness
  public update(id: any, branchFitness: BranchFitness): Promise<any> {
    branchFitness.branchFitnessId = id;
    return this.branchFitnessRepository.save(branchFitness);
  }

  // branchFitness List
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
      return this.branchFitnessRepository.count(condition);
    } else {
      return this.branchFitnessRepository.find(condition);
    }
  }
  // delete branchFitness
  public async delete(id: number): Promise<any> {
    return await this.branchFitnessRepository.delete(id);
  }
}
