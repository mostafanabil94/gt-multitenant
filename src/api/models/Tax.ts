import {Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { BranchTax } from './BranchTax';

@Entity('tax')
export class Tax extends BaseModel {

    @PrimaryGeneratedColumn({name: 'tax_id'})
    public taxId: number;

    @Column({name: 'tax_name'})
    public taxName: string;

    @Column({name: 'tax_percentage'})
    public taxPercentage: number;

    @Column({name: 'tax_status'})
    public taxStatus: number;

    @OneToMany(
        (type) => BranchTax,
        (branchTax) => branchTax.tax
      )
      public branchTax: BranchTax[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
