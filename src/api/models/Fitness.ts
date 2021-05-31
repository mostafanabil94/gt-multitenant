import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import * as bcrypt from "bcrypt";
import moment = require("moment/moment");
import { Exclude } from "class-transformer";

@Entity("fitness")
export class Fitness extends BaseModel {
  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  public static comparePassword(
    user: Fitness,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(res === true);
      });
    });
  }

  @PrimaryGeneratedColumn({ name: "fitnessId" })
  public fitnessId: number;

  @Column({ name: "first_name" })
  public firstName: string;

  @Column({ name: "last_name" })
  public lastName: string;

  @Column({ name: "username" })
  public username: string;

  @Exclude()
  @Column({ name: "password" })
  public password: string;

  @Column({ name: "email" })
  public email: string;

  @Column({ name: "mobile" })
  public mobileNumber: number;

  @Column({ name: "address" })
  public address: string;

  @Column({ name: "avatar" })
  public avatar: string;

  @Column({ name: "avatar_path" })
  public avatarPath: string;

  @Column({ name: "last_login" })
  public lastLogin: string;

  @Column({ name: "ip" })
  public ip: number;

  @Exclude()
  @Column({ name: "mail_status" })
  public mailStatus: number;

  @Exclude()
  @Column({ name: "delete_flag" })
  public deleteFlag: number;

  @Exclude()
  @Column({ name: "is_active" })
  public isActive: number;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
