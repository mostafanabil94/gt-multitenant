import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateClientMembershipPlanRequest {
  @IsNotEmpty({
    message: "customerId is required",
  })
  public customerId: number;

  @IsNotEmpty({
    message: "membershipPlanId is required",
  })
  public membershipPlanId: number;

  @IsNotEmpty({
    message: "salesId is required",
  })
  public salesId: number;
}
