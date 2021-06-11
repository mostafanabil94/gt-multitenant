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
  import { Sales } from "./Sales";

  @Entity("branch_sales")
  export class BranchSales extends BaseModel {
    @PrimaryGeneratedColumn({ name: "branch_sales_id" })
    public branchSalesId: number;

    @Column({ name: "branch_id" })
    public branchId: number;

    @Column({ name: "sales_id" })
    public salesId: number;

    @Column({ name: "is_active" })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchSales)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Sales, (sales) => sales.branchSales)
    @JoinColumn({ name: "sales_id" })
    public sales: Sales;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
      this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
      this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }
}
