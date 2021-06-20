import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Branch } from './Branch';
import { Tax } from './Tax';
@Entity('branch_tax')
export class BranchTax extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'branch_tax_id' })
    public branchTaxId: number;

    @Column({ name: 'tax_id' })
    public taxId: number;

    @Column({ name: 'branch_id' })
    public branchId: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchTax)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Tax, (tax) => tax.branchTax)
    @JoinColumn({ name: "tax_id" })
    public tax: Tax;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
