import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateTaxRequest {

    public taxName: string;

    public taxPercentage: number;

    @IsNotEmpty()
    public taxStatus: number;
}
