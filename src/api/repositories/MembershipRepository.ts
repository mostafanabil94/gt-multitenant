import { EntityRepository, Repository } from "typeorm";
import { Membership } from "../models/Membership";

@EntityRepository(Membership)
export class MembershipRepository extends Repository<Membership> {}
