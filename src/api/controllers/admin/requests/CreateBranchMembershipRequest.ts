import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchMembershipRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "membershipId is required",
  })
  public membershipId: number;

  public status: number;
}
