import { IsNotEmpty } from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { User } from "./User";
import { BaseModel } from "./BaseModel";
import moment = require("moment");

@Entity("user_group")
export class UserGroup extends BaseModel {
  @PrimaryGeneratedColumn({ name: "group_id" })
  public groupId: number;

  @IsNotEmpty()
  @Column({ name: "name" })
  public name: string;

  @Exclude()
  @Column({ name: "permission" })
  public permission: string;

  @Exclude()
  @Column({ name: "is_active" })
  public isActive: number;

  @OneToMany((type) => User, (user) => user.usergroup)
  public users: User[];

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
