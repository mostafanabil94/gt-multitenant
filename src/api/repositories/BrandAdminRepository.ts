import { EntityRepository, Repository } from "typeorm";
import { BrandAdmin } from "../models/BrandAdmin";

@EntityRepository(BrandAdmin)
export class BrandAdminRepository extends Repository<BrandAdmin> {}
