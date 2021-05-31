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

@Entity("room")
export class Room extends BaseModel {
  @PrimaryGeneratedColumn({ name: "room_id" })
  public roomId: number;

  @Column({ name: "branch_id" })
  public branchId: number;

  @Column({ name: "name" })
  public room: string;

  @Column({ name: "is_active" })
  public isActive: number;

  @Column({ name: "created_by_type" })
  public createdByType: number;

  @Column({ name: "modified_by_type" })
  public modifiedByType: number;

  @ManyToOne((type) => Branch, (branch) => branch.room)
  @JoinColumn({ name: "branch_id" })
  public branch: Branch;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
