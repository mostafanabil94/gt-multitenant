import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBrandAdminRequest {
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
