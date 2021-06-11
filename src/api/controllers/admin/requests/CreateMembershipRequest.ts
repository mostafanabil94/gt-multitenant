import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateMembershipRequest {
  @IsNotEmpty({
    message: "name is required",
  })
  public name: number;

  public description: number;

  @IsNotEmpty({
    message: "isPrivate is required",
  })
  public isPrivate: number;

  @IsNotEmpty({
    message: "isOnePurchase is required",
  })
  public isOnePurchase: number;

  @IsNotEmpty({
    message: "isTrial is required",
  })
  public isTrial: number;

  public status: number;
}
