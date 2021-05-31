/*
 * spurtcommerce API
 * version 4.2
 * Copyright (c) 2020 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class DeleteCustomerGroupRequest {

    @IsNotEmpty()
    public groupId: number;

}
