import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchTaxRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "taxId is required",
  })
  public taxId: number;

  public status: number;
}
