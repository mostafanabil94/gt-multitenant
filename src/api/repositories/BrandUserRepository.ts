import { EntityRepository, Repository } from "typeorm";
import { BrandUser } from "../models/BrandUser";

@EntityRepository(BrandUser)
export class BrandUserRepository extends Repository<BrandUser> {}
