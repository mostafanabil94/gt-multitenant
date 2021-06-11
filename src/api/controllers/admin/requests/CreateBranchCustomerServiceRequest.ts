import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchCustomerServiceRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "customerServiceId is required",
  })
  public customerServiceId: number;

  public status: number;
}
