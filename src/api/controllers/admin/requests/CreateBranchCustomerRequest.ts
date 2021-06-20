import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchCustomerRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "customerId is required",
  })
  public customerId: number;

  @IsNotEmpty({
    message: "isHome is required",
  })
  public isHome: number;

  public status: number;
}
