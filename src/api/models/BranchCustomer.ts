import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Branch } from './Branch';
import { Customer } from './Customer';
@Entity('branch_customer')
export class BranchCustomer extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'branch_customer_id' })
    public branchCustomerId: number;

    @Column({ name: 'customer_id' })
    public customerId: number;

    @Column({ name: 'branch_id' })
    public branchId: number;

    @Column({ name: 'is_home' })
    public isHome: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchCustomer)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Customer, (customer) => customer.branchCustomer)
    @JoinColumn({ name: "customer_id" })
    public customer: Customer;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
