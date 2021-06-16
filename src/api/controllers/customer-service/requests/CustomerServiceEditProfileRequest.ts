import "reflect-metadata";
import { IsNotEmpty, IsEmail, IsOptional, MinLength } from "class-validator";

export class CustomerServiceEditProfileRequest {
  // @IsString()
  @IsNotEmpty({
    message: "First name is required",
  })
  public firstName: string;

  public lastName: string;

  public username: string;

  @IsOptional()
  @MinLength(5, {
    message: "Old Password is minimum 5 character",
  })
  @IsNotEmpty()
  public password: string;

  @IsEmail(
    {},
    {
      message: "Please provide username as emailId",
    }
  )
  @IsNotEmpty({
    message: "Email Id is required",
  })
  public email: string;

  @IsOptional()
  @IsNotEmpty()
  public mobileNumber: number;

  public image: string;

  public mailStatus: number;

  public address: string;

}
