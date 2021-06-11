import { EntityRepository, Repository } from "typeorm";
import { BranchSales } from "../models/BranchSales";

@EntityRepository(BranchSales)
export class BranchSalesRepository extends Repository<BranchSales> {}
