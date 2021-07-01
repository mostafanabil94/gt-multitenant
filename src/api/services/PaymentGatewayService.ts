import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { PaymentGatewayRepository } from "../repositories/PaymentGatewayRepository";
import { PaymentGateway } from "../models/PaymentGateway";

@Service()
export class PaymentGatewayService {
  constructor(
    @OrmRepository() private paymentGatewayRepository: PaymentGatewayRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create paymentGateway
  public async create(paymentGateway: any): Promise<PaymentGateway> {
    this.log.info("Create a new PaymentGateway ");
    return this.paymentGatewayRepository.save(paymentGateway);
  }

  // find Condition
  public findOne(paymentGateway: any): Promise<any> {
    return this.paymentGatewayRepository.findOne(paymentGateway);
  }

  // update paymentGateway
  public update(id: any, paymentGateway: PaymentGateway): Promise<any> {
    paymentGateway.paymentGatewayId = id;
    return this.paymentGatewayRepository.save(paymentGateway);
  }

  // paymentGateway List
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
      return this.paymentGatewayRepository.count(condition);
    } else {
      return this.paymentGatewayRepository.find(condition);
    }
  }
  // delete paymentGateway
  public async delete(id: number): Promise<any> {
    return await this.paymentGatewayRepository.delete(id);
  }
}
