import "reflect-metadata";
import { IsNotEmpty } from "class-validator";
export class DeleteCustomerServiceRequest {
  @IsNotEmpty()
  public customerServiceId: [];
}
