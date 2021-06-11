import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateMembershipPlanRequest {
  @IsNotEmpty({
    message: "name is required",
  })
  public name: number;

  @IsNotEmpty({
    message: "membershipId is required",
  })
  public membershipId: number;

  @IsNotEmpty({
    message: "isMultipleClients is required",
  })
  public isMultipleClients: boolean;

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

  public isStartMonth: boolean;

  public isFreePeriod: boolean;

  public isProrate: boolean;

  public isEndingPeriod: boolean;

  public endPeriod: number;

  public isAutorenew: boolean;

  public isJoiningFee: boolean;

  public joiningFee: number;

  public status: number;
}
