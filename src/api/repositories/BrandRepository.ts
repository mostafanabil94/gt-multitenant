import { EntityRepository, Repository } from "typeorm";
import { Brand } from "../models/Brand";

@EntityRepository(Brand)
export class BrandRepository extends Repository<Brand> {}
