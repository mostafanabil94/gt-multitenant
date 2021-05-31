import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateAddress {

    @IsNotEmpty()
    public customerId: number;

    @IsNotEmpty()
    public address1: string;

    public address2: string;

    @IsNotEmpty()
    public city: string;

    @IsNotEmpty()
    public state: string;

    public postcode: number;

    @IsNotEmpty()
    public addressType: number;
}
