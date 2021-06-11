import {
    Column,
    Entity,
    BeforeInsert,
    BeforeUpdate,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { BaseModel } from "./BaseModel";
  import moment = require("moment/moment");
  import { Branch } from "./Branch";
  import { Fitness } from "./Fitness";

  @Entity("branch_fitness")
  export class BranchFitness extends BaseModel {
    @PrimaryGeneratedColumn({ name: "branch_fitness_id" })
    public branchFitnessId: number;

    @Column({ name: "branch_id" })
    public branchId: number;

    @Column({ name: "fitness_id" })
    public fitnessId: number;

    @Column({ name: "is_active" })
    public isActive: number;

    @Column({ name: "created_by_type" })
    public createdByType: number;

    @Column({ name: "modified_by_type" })
    public modifiedByType: number;

    @ManyToOne((type) => Branch, (branch) => branch.branchFitness)
    @JoinColumn({ name: "branch_id" })
    public branch: Branch;

    @ManyToOne((type) => Fitness, (fitness) => fitness.branchFitness)
    @JoinColumn({ name: "fitness_id" })
    public fitness: Fitness;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
      this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
      this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }
}
