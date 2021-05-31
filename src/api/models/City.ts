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
import { Exclude } from "class-transformer";
import { Country } from "./Country";
import moment = require("moment/moment");

@Entity("city")
export class City extends BaseModel {
  @PrimaryGeneratedColumn({ name: "city_id" })
  public cityId: number;

  @Exclude()
  @Column({ name: "country_id" })
  public countryId: number;

  @Column({ name: "name" })
  public name: string;

  @ManyToOne((type) => Country, (country) => country.city)
  @JoinColumn({ name: "country_id" })
  public country: Country;

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
