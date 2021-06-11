import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { BrandMembership } from './BrandMembership';
import { BranchMembership } from './BranchMembership';
import { MembershipPlan } from './MembershipPlan';
@Entity('membership')
export class Membership extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'membership_id' })
    public membershipId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'is_one_purchase' })
    public isOnePurchase: number;

    @Column({ name: 'is_private' })
    public isPrivate: number;

    @Column({ name: 'is_trial' })
    public isTrial: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @OneToMany((type) => BrandMembership, (brandMembership) => brandMembership.brand)
    public brandMembership: BrandMembership[];

    @OneToMany((type) => BranchMembership, (branchMembership) => branchMembership.branch)
    public branchMembership: BranchMembership[];

    @OneToMany((type) => MembershipPlan, (membershipPlan) => membershipPlan.membership)
    public membershipPlan: MembershipPlan[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
