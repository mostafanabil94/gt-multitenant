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
  import { CustomerService } from "./CustomerService";

  @Entity("branch_customer_service")
  export class BranchCustomerService extends BaseModel {
    @PrimaryGeneratedColumn({ name: "branch_customer_service_id" })
    public branchCustomerServiceId: number;

    @Column({ name: "branch_id" })
    public branchId: number;

    @Column({ name: "customer_service_id" })
    public customerServiceId: number;

    @Column({ name: "is_active" })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchCustomerService)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => CustomerService, (customerService) => customerService.branchCustomerService)
    @JoinColumn({ name: "customer_service_id" })
    public customerService: CustomerService;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
      this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
      this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }
}
