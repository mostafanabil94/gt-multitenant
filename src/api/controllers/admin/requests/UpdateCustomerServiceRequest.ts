import "reflect-metadata";
import { IsNotEmpty, IsEmail } from "class-validator";
export class UpdateCustomerService {
  @IsNotEmpty()
  public username: string;

  public firstName: string;

  public lastName: string;

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
