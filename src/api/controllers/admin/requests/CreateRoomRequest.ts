import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateRoomRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "name is required",
  })
  public name: string;

  public status: number;
}
