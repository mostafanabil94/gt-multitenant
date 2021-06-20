import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchCurrencyRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "currencyId is required",
  })
  public currencyId: number;

  public status: number;
}
