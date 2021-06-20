import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBrandUserRequest {
  @IsNotEmpty({
    message: "brandId is required",
  })
  public brandId: number;

  @IsNotEmpty({
    message: "userId is required",
  })
  public userId: number;

  public status: number;
}
