import { EntityRepository, Repository } from "typeorm";
import { BranchAdmin } from "../models/BranchAdmin";

@EntityRepository(BranchAdmin)
export class BranchAdminRepository extends Repository<BranchAdmin> {}
