import { EntityRepository, Repository } from "typeorm";
import { Branch } from "../models/Branch";

@EntityRepository(Branch)
export class BranchRepository extends Repository<Branch> {}
