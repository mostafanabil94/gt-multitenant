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
import { PaymentGateway } from "./PaymentGateway";

@Entity("branch_payment_gateway")
export class BranchPaymentGateway extends BaseModel {
    @PrimaryGeneratedColumn({ name: "branch_payment_gateway_id" })
    public branchPaymentGatewayId: number;

    @Column({ name: "branch_id" })
    public branchId: number;

    @Column({ name: "payment_gateway_id" })
    public paymentGatewayId: number;

    @Column({ name: "payment_gateway_data" })
    public paymentGatewayData: string;

    @Column({ name: "is_active" })
    public isActive: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchPaymentGateway)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => PaymentGateway, (paymentGateway) => paymentGateway.branchPaymentGateway)
    @JoinColumn({ name: "payment_gateway_id" })
    public paymentGateway: PaymentGateway;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }
}
