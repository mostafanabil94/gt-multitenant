import "reflect-metadata";
import { IsNotEmpty, IsEmail, MinLength, IsOptional } from "class-validator";
export class CustomerRegisterRequest {
  @IsNotEmpty({
    message: "username is required",
  })
  public username: string;

  @MinLength(5, {
    message: "password is minimum 5 character",
  })
  @IsNotEmpty({
    message: "password is required",
  })
  public password: string;

  @MinLength(5, {
    message: "Confirm password is minimum 5 character",
  })
  @IsNotEmpty({
    message: "Confirm password password is required",
  })
  public confirmPassword: string;
  @IsEmail(
    {},
    {
      message: "Please provide valid email",
    }
  )
  @IsNotEmpty({
    message: "Email is required",
  })
  public email: string;

  @IsNotEmpty({
    message: "First name is required",
  })
  public firstName: string;

  @IsNotEmpty({
    message: "Last Name is required",
  })
  public lastName: string;

  @IsOptional()
  public mobileNumber: number;
}
