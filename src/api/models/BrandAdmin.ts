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
import { Brand } from "./Brand";
import { User } from "./User";

@Entity("brand_admin")
export class BrandAdmin extends BaseModel {
  @PrimaryGeneratedColumn({ name: "brand_admin_id" })
  public brandAdminId: number;

  @Column({ name: "brand_id" })
  public brandId: number;

  @Column({ name: "user_id" })
  public userId: number;

  @Column({ name: "is_active" })
  public isActive: number;

  @Column({ name: "created_by_type" })
  public createdByType: number;

  @Column({ name: "modified_by_type" })
  public modifiedByType: number;

  @ManyToOne((type) => Brand, (brand) => brand.brandAdmin)
  @JoinColumn({ name: "brand_id" })
  public brand: Brand;

  @ManyToOne((type) => User, (user) => user.brandAdmin)
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
