import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchPaymentGatewayRequest {
  @IsNotEmpty({
    message: "branchId is required",
  })
  public branchId: number;

  @IsNotEmpty({
    message: "paymentGatewayId is required",
  })
  public paymentGatewayId: number;

  @IsNotEmpty({
    message: "paymentGatewayData is required",
  })
  public paymentGatewayData: string;

  public status: number;
}
