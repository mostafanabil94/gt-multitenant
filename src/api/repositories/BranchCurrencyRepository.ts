import { EntityRepository, Repository } from "typeorm";
import { BranchCurrency } from "../models/BranchCurrency";

@EntityRepository(BranchCurrency)
export class BranchCurrencyRepository extends Repository<BranchCurrency> {}
