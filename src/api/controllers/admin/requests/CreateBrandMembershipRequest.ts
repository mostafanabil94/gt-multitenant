import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBrandMembershipRequest {
  @IsNotEmpty({
    message: "brandId is required",
  })
  public brandId: number;

  @IsNotEmpty({
    message: "membershipId is required",
  })
  public membershipId: number;

  public status: number;
}
