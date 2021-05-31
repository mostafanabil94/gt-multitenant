import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { CustomerServiceRepository } from "../repositories/CustomerServiceRepository";

@Service()
export class CustomerServiceService {
  constructor(
    @OrmRepository()
    private customerServiceRepository: CustomerServiceRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create customerService
  public async create(customerService: any): Promise<any> {
    this.log.info("Create a new customerService ");
    return this.customerServiceRepository.save(customerService);
  }

  // find Condition
  public findOne(customerService: any): Promise<any> {
    return this.customerServiceRepository.findOne(customerService);
  }

  // find Condition
  public findAll(): Promise<any> {
    return this.customerServiceRepository.find();
  }

  // update customerService
  public update(id: any, customerService: any): Promise<any> {
    customerService.customerServiceId = id;
    return this.customerServiceRepository.save(customerService);
  }
  // customerService List
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
      return this.customerServiceRepository.count(condition);
    } else {
      return this.customerServiceRepository.find(condition);
    }
  }
  // delete customerService
  public async delete(id: number): Promise<any> {
    return await this.customerServiceRepository.delete(id);
  }
  // today customerService count
  public async todayCustomerServiceCount(todaydate: string): Promise<any> {
    return await this.customerServiceRepository.TodayCustomerServiceCount(
      todaydate
    );
  }
}
