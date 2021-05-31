import { EntityRepository, Repository } from 'typeorm';
import { CustomerDocument } from '../models/CustomerDocument';

@EntityRepository(CustomerDocument)
export class CustomerDocumentRepository extends Repository<CustomerDocument>  {

}
