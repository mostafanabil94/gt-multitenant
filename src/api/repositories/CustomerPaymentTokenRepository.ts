import { EntityRepository, Repository } from "typeorm";
import { CustomerPaymentToken } from "../models/CustomerPaymentToken";

@EntityRepository(CustomerPaymentToken)
export class CustomerPaymentTokenRepository extends Repository<CustomerPaymentToken> {}
