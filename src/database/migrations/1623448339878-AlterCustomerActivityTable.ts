import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCustomerActivityTable1623448339878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `customer_activity` CHANGE `product_id` `description` VARCHAR(255) COLLATE utf8mb4_unicode_ci NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `customer_activity` CHANGE `product_id` `description` VARCHAR(255) COLLATE utf8mb4_unicode_ci NULL"
    );
  }
}
