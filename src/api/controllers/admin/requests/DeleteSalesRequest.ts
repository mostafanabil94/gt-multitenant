import "reflect-metadata";
import { IsNotEmpty } from "class-validator";
export class DeleteSalesRequest {
  @IsNotEmpty()
  public salesId: [];
}
