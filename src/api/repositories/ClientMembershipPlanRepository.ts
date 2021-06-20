import { EntityRepository, Repository } from "typeorm";
import { ClientMembershipPlan } from "../models/ClientMembershipPlan";

@EntityRepository(ClientMembershipPlan)
export class ClientMembershipPlanRepository extends Repository<ClientMembershipPlan> {}
