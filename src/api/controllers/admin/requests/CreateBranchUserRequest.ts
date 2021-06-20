import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchUserRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "userId is required",
  })
  public userId: number;

  public status: number;
}
