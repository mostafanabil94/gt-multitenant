import { EntityRepository, Repository } from "typeorm";
import { BrandMembership } from "../models/BrandMembership";

@EntityRepository(BrandMembership)
export class BrandMembershipRepository extends Repository<BrandMembership> {}
