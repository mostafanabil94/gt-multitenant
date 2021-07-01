import { EntityRepository, Repository } from 'typeorm';
import { BranchPaymentGateway } from '../models/BranchPaymentGateway';

@EntityRepository(BranchPaymentGateway)
export class BranchPaymentGatewayRepository extends Repository<BranchPaymentGateway>  {

}
