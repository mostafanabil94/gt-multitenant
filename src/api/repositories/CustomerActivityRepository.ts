/*
 * spurtcommerce API
 * version 4.2
 * Copyright (c) 2020 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { CustomerActivity } from '../models/CustomerActivity';

@EntityRepository(CustomerActivity)
export class CustomerActivityRepository extends Repository<CustomerActivity>  {

}
