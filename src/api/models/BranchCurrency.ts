import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Branch } from './Branch';
import { Currency } from './Currency';
@Entity('branch_currency')
export class BranchCurrency extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'branch_currency_id' })
    public branchCurrencyId: number;

    @Column({ name: 'currency_id' })
    public currencyId: number;

    @Column({ name: 'branch_id' })
    public branchId: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchCurrency)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Currency, (currency) => currency.branchCurrency)
    @JoinColumn({ name: "currency_id" })
    public currency: Currency;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
