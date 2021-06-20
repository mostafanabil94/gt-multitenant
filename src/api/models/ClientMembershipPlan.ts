import {
    Column,
    Entity,
    BeforeInsert,
    BeforeUpdate,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import moment = require("moment/moment");
import { User } from "./User";
import { MembershipPlan } from "./MembershipPlan";
import { Customer } from "./Customer";

@Entity("client_membership_plan")
export class ClientMembershipPlan extends BaseModel {
  @PrimaryGeneratedColumn({ name: "client_membership_plan_id" })
  public clientMembershipPlanId: number;

  @Column({ name: "customer_id" })
  public customerId: number;

  @Column({ name: "membership_plan_id" })
  public membershipPlanId: number;

  @Column({ name: "sales_id" })
  public salesId: number;

  @Column({ name: "start_date" })
  public startDate: string;

  @Column({ name: "end_date" })
  public endDate: string;

  @Column({ name: "price" })
  public price: number;

  @Column({ name: "total_paid" })
  public totalPaid: number;

  @Column({ name: "is_active" })
  public isActive: number;

  @Column({ name: "created_by_type" })
  public createdByType: number;

  @Column({ name: "modified_by_type" })
  public modifiedByType: number;

  @ManyToOne((type) => User, (sales) => sales.clientMembershipPlan)
  @JoinColumn({ name: "sales_id" })
  public sales: User;

  @ManyToOne((type) => MembershipPlan, (membershipPlan) => membershipPlan.clientMembershipPlan)
  @JoinColumn({ name: "membership_plan_id" })
  public membershipPlan: MembershipPlan;

  @ManyToOne((type) => Customer, (customer) => customer.clientMembershipPlan)
  @JoinColumn({ name: "customer_id" })
  public customer: Customer;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
