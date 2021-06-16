import "reflect-metadata";
import { IsNotEmpty, IsEmail } from "class-validator";

export class CustomerServiceOauthLogin {
  @IsEmail(
    {},
    {
      message: "Please give valid emailId",
    }
  )
  @IsNotEmpty({
    message: "Email Id is required",
  })
  public emailId: string;

  public source: string;

  public oauthData: string;
}
