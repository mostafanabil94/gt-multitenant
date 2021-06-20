import { EntityRepository, Repository } from "typeorm";
import { BranchUser } from "../models/BranchUser";

@EntityRepository(BranchUser)
export class BranchUserRepository extends Repository<BranchUser> {}
