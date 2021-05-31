import { EntityRepository, Repository } from 'typeorm';
import { Customer } from '../models/Customer';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer>  {

    public async TodayCustomerCount(todaydate: string): Promise<any> {

        const query: any = await this.manager.createQueryBuilder(Customer, 'customer');
        query.select([  'COUNT(customer.id) as customerCount']);
        query.where('DATE(customer.createdDate) = :todaydate', {todaydate});
        console.log(query.getQuery());
        return query.getRawOne();
    }

}
