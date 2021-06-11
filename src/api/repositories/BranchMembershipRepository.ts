import { EntityRepository, Repository } from "typeorm";
import { BranchMembership } from "../models/BranchMembership";

@EntityRepository(BranchMembership)
export class BranchMembershipRepository extends Repository<BranchMembership> {}
