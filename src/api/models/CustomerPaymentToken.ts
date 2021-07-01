import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Branch } from './Branch';
import { Customer } from './Customer';
import { PaymentGateway } from './PaymentGateway';
@Entity('customer_payment_token')
export class CustomerPaymentToken extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'customer_payment_token_id' })
    public customerPaymentTokenId: number;

    @Column({ name: 'customer_id' })
    public customerId: number;

    @Column({ name: 'branch_id' })
    public branchId: number;

    @Column({ name: 'payment_gateway_id' })
    public paymentGatewayId: number;

    @Column({ name: 'token' })
    public token: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.customerPaymentToken)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Customer, (customer) => customer.customerPaymentToken)
    @JoinColumn({ name: "customer_id" })
    public customer: Customer;

    @ManyToOne((type) => PaymentGateway, (paymentGateway) => paymentGateway.customerPaymentToken)
    @JoinColumn({ name: "payment_gateway_id" })
    public paymentGateway: PaymentGateway;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
