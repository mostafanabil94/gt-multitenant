import { EntityRepository, Repository } from "typeorm";
import { BranchTax } from "../models/BranchTax";

@EntityRepository(BranchTax)
export class BranchTaxRepository extends Repository<BranchTax> {}
