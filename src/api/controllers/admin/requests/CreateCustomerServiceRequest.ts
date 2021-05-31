import "reflect-metadata";
import { IsNotEmpty, IsEmail } from "class-validator";
export class CreateCustomerService {
  @IsNotEmpty()
  public username: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public mobileNumber: number;

  public password: string;

  public confirmPassword: string;

  public avatar: string;

  public newsletter: number;

  @IsNotEmpty()
  public mailStatus: number;

  public status: number;
}
