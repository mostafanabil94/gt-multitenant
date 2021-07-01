import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { CustomerPaymentTokenRepository } from "../repositories/CustomerPaymentTokenRepository";
import { CustomerPaymentToken } from "../models/CustomerPaymentToken";

@Service()
export class CustomerPaymentTokenService {
  constructor(
    @OrmRepository() private customerPaymentTokenRepository: CustomerPaymentTokenRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create customer Payment Token
  public async create(customerPaymentToken: any): Promise<CustomerPaymentToken> {
    this.log.info("Create a new Payment Payment Token ");
    return this.customerPaymentTokenRepository.save(customerPaymentToken);
  }

  // find Condition
  public findOne(customerPaymentToken: any): Promise<any> {
    return this.customerPaymentTokenRepository.findOne(customerPaymentToken);
  }

  // update customer Payment Token
  public update(id: any, customerPaymentToken: CustomerPaymentToken): Promise<any> {
    customerPaymentToken.customerPaymentTokenId = id;
    return this.customerPaymentTokenRepository.save(customerPaymentToken);
  }

  // customer Payment Token List
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
      return this.customerPaymentTokenRepository.count(condition);
    } else {
      return this.customerPaymentTokenRepository.find(condition);
    }
  }
  // delete customer Payment Token
  public async delete(id: number): Promise<any> {
    return await this.customerPaymentTokenRepository.delete(id);
  }
}
