import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import * as bcrypt from "bcrypt";
import moment = require("moment/moment");
import { Exclude } from "class-transformer";
import { Country } from "./Country";
import { CustomerDocument } from "./CustomerDocument";
import { CustomerGroup } from "./CustomerGroup";

@Entity("customer")
export class Customer extends BaseModel {
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
    user: Customer,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(res === true);
      });
    });
  }

  @PrimaryGeneratedColumn({ name: "id" })
  public id: number;

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

  @Column({ name: "country_id" })
  public countryId: number;

  @Column({ name: "city_id" })
  public cityId: number;

  @Column({ name: "avatar" })
  public avatar: string;

  @Column({ name: "avatar_path" })
  public avatarPath: string;

  @Exclude()
  @Column({ name: "customer_group_id" })
  public customerGroupId: number;

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

  @ManyToOne((type) => CustomerGroup, (customergroup) => customergroup.customer)
  @JoinColumn({ name: "customer_group_id" })
  public customerGroup: CustomerGroup;

  @ManyToOne((type) => Country, (country) => country.customer)
  @JoinColumn({ name: "country_id" })
  public country: Country;

  @OneToMany(
    (type) => CustomerDocument,
    (customerDocument) => customerDocument.customer
  )
  public customerDocument: CustomerDocument[];

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
