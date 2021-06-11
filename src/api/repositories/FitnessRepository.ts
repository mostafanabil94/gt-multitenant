import { EntityRepository, Repository } from "typeorm";
import { Fitness } from "../models/Fitness";

@EntityRepository(Fitness)
export class FitnessRepository extends Repository<Fitness> {
  public async TodayFitnessCount(todaydate: string): Promise<any> {
    const query: any = await this.manager.createQueryBuilder(
      Fitness,
      "fitness"
    );
    query.select(["COUNT(fitness.fitnessId) as fitnessCount"]);
    query.where("DATE(fitness.createdDate) = :todaydate", { todaydate });
    console.log(query.getQuery());
    return query.getRawOne();
  }
}
