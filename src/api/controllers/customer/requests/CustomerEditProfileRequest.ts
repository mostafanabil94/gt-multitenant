import "reflect-metadata";
import { IsNotEmpty, IsEmail, IsOptional, MinLength } from "class-validator";

export class CustomerEditProfileRequest {
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

  public gender: number;

  public source: number;

  public type: number;

  public dob: string;

  public membershipCode: string;

  public mailStatus: number;

  public middleName: string;

  public fullName: string;

  public address: string;

  public countryId: number;

  public cityId: number;

}
