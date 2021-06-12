import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateMembershipPlanRequest {
  @IsNotEmpty({
    message: "name is required",
  })
  public name: string;

  @IsNotEmpty({
    message: "membershipId is required",
  })
  public membershipId: number;

  @IsNotEmpty({
    message: "isMultipleClients is required",
  })
  public isMultipleClients: number;

  public maxNumberOfClients: number;

  @IsNotEmpty({
    message: "type is required",
  })
  public type: number;

  @IsNotEmpty({
    message: "price is required",
  })
  public price: number;

  @IsNotEmpty({
    message: "periodType is required",
  })
  public periodType: number;

  public forPeriod: number;

  public everyPeriod: number;

  public isStartMonth: number;

  public isFreePeriod: number;

  public isProrate: number;

  public isEndingPeriod: number;

  public endPeriod: number;

  public isAutorenew: number;

  public isJoiningFee: number;

  public joiningFee: number;

  public status: number;
}
