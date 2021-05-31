import "reflect-metadata";
import { IsNotEmpty } from "class-validator";

export class CreateBranchRequest {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public brandId: number;

  @IsNotEmpty()
  public email: string;

  public logo: string;

  public image: string;

  public legalName: string;

  public phone: string;

  public status: number;
}
