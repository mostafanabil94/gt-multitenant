import 'reflect-metadata';
import { IsNotEmpty , MaxLength } from 'class-validator';

export class CreateCurrency {

    @MaxLength(30, {
        message: 'title is maximum 30 character',
    })
    @IsNotEmpty()
    public title: string;

    @MaxLength(3, {
        message: 'code is maximum 3 character',
    })
    public code: string;

    public symbolLeft: string;

    public symbolRight: string;

    @IsNotEmpty()
    public status: number;
}
