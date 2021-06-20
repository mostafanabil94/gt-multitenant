import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Membership } from './Membership';
import { ClientMembershipPlan } from './ClientMembershipPlan';
@Entity('membership_plan')
export class MembershipPlan extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'membership_plan_id' })
    public membershipPlanId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'membership_id' })
    public membershipId: number;

    @Column({ name: 'is_multiple_clients' })
    public isMultipleClients: number;

    @Column({ name: 'max_number_of_clients' })
    public maxNumberOfClients: number;

    @Column({ name: 'type' })
    public type: number;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'period_type' })
    public periodType: number;

    @Column({ name: 'for_period' })
    public forPeriod: number;

    @Column({ name: 'every_period' })
    public everyPeriod: number;

    @Column({ name: 'is_start_month' })
    public isStartMonth: number;

    @Column({ name: 'is_free_period' })
    public isFreePeriod: number;

    @Column({ name: 'is_prorate' })
    public isProrate: number;

    @Column({ name: 'is_ending_period' })
    public isEndingPeriod: number;

    @Column({ name: 'end_period' })
    public endPeriod: number;

    @Column({ name: 'is_autorenew' })
    public isAutorenew: number;

    @Column({ name: 'is_joining_fee' })
    public isJoiningFee: number;

    @Column({ name: 'joining_fee' })
    public joiningFee: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Membership, (membership) => membership.membershipPlan)
    @JoinColumn({ name: "membership_id" })
    public membership: Membership;

    @OneToMany((type) => ClientMembershipPlan, (clientMembershipPlan) => clientMembershipPlan.membershipPlan)
    public clientMembershipPlan: ClientMembershipPlan[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
