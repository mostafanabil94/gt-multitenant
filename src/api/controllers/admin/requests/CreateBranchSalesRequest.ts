import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchSalesRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "salesId is required",
  })
  public salesId: number;

  public status: number;
}
