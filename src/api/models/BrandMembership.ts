import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Brand } from './Brand';
import { Membership } from './Membership';
@Entity('brand_membership')
export class BrandMembership extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'brand_membership_id' })
    public brandMembershipId: number;

    @Column({ name: 'membership_id' })
    public membershipId: number;

    @Column({ name: 'brand_id' })
    public brandId: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Brand, (brand) => brand.brandMembership)
    @JoinColumn({ name: "brand_id" })
    public brand: Brand;

    @ManyToOne((type) => Membership, (membership) => membership.brandMembership)
    @JoinColumn({ name: "membership_id" })
    public membership: Membership;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
