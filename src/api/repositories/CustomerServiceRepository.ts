import { EntityRepository, Repository } from "typeorm";
import { CustomerService } from "../models/CustomerService";

@EntityRepository(CustomerService)
export class CustomerServiceRepository extends Repository<CustomerService> {
  public async TodayCustomerServiceCount(todaydate: string): Promise<any> {
    const query: any = await this.manager.createQueryBuilder(
      CustomerService,
      "customerService"
    );
    query.select(["COUNT(customerService.customerServiceId) as customerServiceCount"]);
    query.where("DATE(customerService.createdDate) = :todaydate", {
      todaydate,
    });
    console.log(query.getQuery());
    return query.getRawOne();
  }
}
