import { EntityRepository, Repository } from "typeorm";
import { Sales } from "../models/Sales";

@EntityRepository(Sales)
export class SalesRepository extends Repository<Sales> {
  public async TodaySalesCount(todaydate: string): Promise<any> {
    const query: any = await this.manager.createQueryBuilder(Sales, "sales");
    query.select(["COUNT(sales.id) as salesCount"]);
    query.where("DATE(sales.createdDate) = :todaydate", { todaydate });
    console.log(query.getQuery());
    return query.getRawOne();
  }
}
