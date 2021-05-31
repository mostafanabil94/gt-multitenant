import {BeforeInsert, BeforeUpdate, Column, Entity} from 'typeorm';
import {PrimaryGeneratedColumn} from 'typeorm/index';
import {BaseModel} from './BaseModel';
import moment = require('moment');
@Entity('currency')
export class Currency extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'currency_id' })
    public currencyId: number;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'code' })
    public code: string;

    @Column({ name: 'symbol_left' })
    public symbolLeft: string;

    @Column({ name: 'symbol_right' })
    public symbolRight: string;

    @Column({ name: 'decimal_place' })
    public decimalPlace: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

}
