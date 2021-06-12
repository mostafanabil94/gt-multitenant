import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import moment = require("moment/moment");
@Entity("customer_activity")
export class CustomerActivity extends BaseModel {
  @PrimaryGeneratedColumn({ name: "customer_activity_id" })
  public customerActivityId: number;

  @Column({ name: "customer_id" })
  public customerId: number;

  @Column({ name: "activity_id" })
  public activityId: number;

  @Column({ name: "description" })
  public description: string;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
