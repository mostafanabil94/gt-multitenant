import "reflect-metadata";
import { IsNotEmpty } from "class-validator";
export class DeleteFitnessRequest {
  @IsNotEmpty()
  public fitnessId: [];
}
