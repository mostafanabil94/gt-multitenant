import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchFitnessRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "fitnessId is required",
  })
  public fitnessId: number;

  public status: number;
}
