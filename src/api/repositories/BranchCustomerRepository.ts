import { EntityRepository, Repository } from "typeorm";
import { BranchCustomer } from "../models/BranchCustomer";

@EntityRepository(BranchCustomer)
export class BranchCustomerRepository extends Repository<BranchCustomer> {}
