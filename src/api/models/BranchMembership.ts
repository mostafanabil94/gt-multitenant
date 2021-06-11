import { Column, Entity, BeforeInsert, BeforeUpdate , PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
import { Branch } from './Branch';
import { Membership } from './Membership';
@Entity('branch_membership')
export class BranchMembership extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'branch_membership_id' })
    public branchMembershipId: number;

    @Column({ name: 'membership_id' })
    public membershipId: number;

    @Column({ name: 'branch_id' })
    public branchId: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchMembership)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Membership, (membership) => membership.branchMembership)
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
