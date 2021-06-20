import 'reflect-metadata';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class Login {

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty({
        message: 'Password is required',
    })
    public password: string;
}
