import { EntityRepository, Repository } from "typeorm";
import { BranchCustomerService } from "../models/BranchCustomerService";

@EntityRepository(BranchCustomerService)
export class BranchCustomerServiceRepository extends Repository<BranchCustomerService> {}
