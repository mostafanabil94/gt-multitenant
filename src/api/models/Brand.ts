import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import moment = require("moment/moment");
import { Branch } from "./Branch";
import { BrandAdmin } from "./BrandAdmin";

@Entity("brand")
export class Brand extends BaseModel {
  @PrimaryGeneratedColumn({ name: "brand_id" })
  public brandId: number;

  @Column({ name: "name" })
  public name: string;

  @Column({ name: "email" })
  public email: string;

  @Column({ name: "logo" })
  public logo: string;

  @Column({ name: "logo_path" })
  public logoPath: string;

  @Column({ name: "image" })
  public image: string;

  @Column({ name: "image_path" })
  public imagePath: string;

  @Column({ name: "legal_name" })
  public legalName: string;

  @Column({ name: "phone" })
  public phone: string;

  @Column({ name: "is_active" })
  public isActive: number;

  @Column({ name: "created_by_type" })
  public createdByType: number;

  @Column({ name: "modified_by_type" })
  public modifiedByType: number;

  @OneToMany((type) => Branch, (branch) => branch.brand)
  public branch: Branch[];

  @OneToMany((type) => BrandAdmin, (brandAdmin) => brandAdmin.brand)
  public brandAdmin: BrandAdmin[];

  @BeforeInsert()
  public async createDetails(): Promise<void> {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  public async updateDetails(): Promise<void> {
    this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
