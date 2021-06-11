import { EntityRepository, Repository } from "typeorm";
import { MembershipPlan } from "../models/MembershipPlan";

@EntityRepository(MembershipPlan)
export class MembershipPlanRepository extends Repository<MembershipPlan> {}
