import { EntityRepository, Repository } from 'typeorm';
import { PaymentGateway } from '../models/PaymentGateway';

@EntityRepository(PaymentGateway)
export class PaymentGatewayRepository extends Repository<PaymentGateway>  {

}
