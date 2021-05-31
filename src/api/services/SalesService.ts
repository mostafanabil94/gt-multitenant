import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { SalesRepository } from "../repositories/SalesRepository";

@Service()
export class SalesService {
  constructor(
    @OrmRepository() private salesRepository: SalesRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create sales
  public async create(sales: any): Promise<any> {
    this.log.info("Create a new sales ");
    return this.salesRepository.save(sales);
  }

  // find Condition
  public findOne(sales: any): Promise<any> {
    return this.salesRepository.findOne(sales);
  }

  // find Condition
  public findAll(): Promise<any> {
    return this.salesRepository.find();
  }

  // update sales
  public update(id: any, sales: any): Promise<any> {
    sales.salesId = id;
    return this.salesRepository.save(sales);
  }
  // sales List
  public list(
    limit: any,
    offset: any,
    search: any = [],
    whereConditions: any = [],
    order: number,
    count: number | boolean
  ): Promise<any> {
    const condition: any = {};

    condition.where = {};

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

    if (order && order > 0) {
      condition.order = {
        createdDate: "DESC",
      };
      condition.take = 5;
    }

    condition.order = {
      createdDate: "DESC",
    };

    if (limit && limit > 0) {
      condition.take = limit;
      condition.skip = offset;
    }
    if (count) {
      return this.salesRepository.count(condition);
    } else {
      return this.salesRepository.find(condition);
    }
  }
  // delete sales
  public async delete(id: number): Promise<any> {
    return await this.salesRepository.delete(id);
  }
  // today sales count
  public async todaySalesCount(todaydate: string): Promise<any> {
    return await this.salesRepository.TodaySalesCount(todaydate);
  }
}
