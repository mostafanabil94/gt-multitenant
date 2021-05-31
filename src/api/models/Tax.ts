import {Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');

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

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
