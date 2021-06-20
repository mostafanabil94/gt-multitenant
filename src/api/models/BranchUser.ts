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
import { Branch } from "./Branch";
import { User } from "./User";

@Entity("branch_user")
export class BranchUser extends BaseModel {
  @PrimaryGeneratedColumn({ name: "branch_user_id" })
  public branchUserId: number;

  @Column({ name: "branch_id" })
  public branchId: number;

  @Column({ name: "user_id" })
  public userId: number;

  @Column({ name: "is_active" })
  public isActive: number;

  @Column({ name: "created_by_type" })
  public createdByType: number;

  @Column({ name: "modified_by_type" })
  public modifiedByType: number;

  @ManyToOne((type) => Branch, (branch) => branch.branchUser)
  @JoinColumn({ name: "branch_id" })
  public branch: Branch;

  @ManyToOne((type) => User, (user) => user.branchUser)
  @JoinColumn({ name: "user_id" })
  public user: User;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
