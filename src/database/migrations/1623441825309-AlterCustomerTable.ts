import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterCustomerTable1623441825309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const ifExist = await queryRunner.hasColumn("customer", "type");
    if (!ifExist) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "type",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("customer", "type");
  }
}
