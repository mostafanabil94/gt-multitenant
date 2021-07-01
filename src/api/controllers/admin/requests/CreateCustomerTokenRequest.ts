import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerToken {

    @IsNotEmpty()
    public customerId: number;

    @IsNotEmpty()
    public branchId: number;

    @IsNotEmpty()
    public cardNumber: string;

    @IsNotEmpty()
    public expiryMonth: string;

    @IsNotEmpty()
    public expiryYear: string;

    @IsNotEmpty()
    public cvv: string;

}
