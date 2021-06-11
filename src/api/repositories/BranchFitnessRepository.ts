import { EntityRepository, Repository } from "typeorm";
import { BranchFitness } from "../models/BranchFitness";

@EntityRepository(BranchFitness)
export class BranchFitnessRepository extends Repository<BranchFitness> {}
