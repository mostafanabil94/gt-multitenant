import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterCustomerTable1623439553355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const ifExist = await queryRunner.hasColumn("customer", "middle_name");
    if (!ifExist) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "middle_name",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        })
      );
    }

    const ifExist1 = await queryRunner.hasColumn("customer", "full_name");
    if (!ifExist1) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "full_name",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        })
      );
    }

    const ifExist2 = await queryRunner.hasColumn("customer", "gender");
    if (!ifExist2) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "gender",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        })
      );
    }

    const ifExist3 = await queryRunner.hasColumn("customer", "dob");
    if (!ifExist3) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "dob",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        })
      );
    }

    const ifExist4 = await queryRunner.hasColumn("customer", "membership_code");
    if (!ifExist4) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "membership_code",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        })
      );
    }

    const ifExist5 = await queryRunner.hasColumn("customer", "source");
    if (!ifExist5) {
      await queryRunner.addColumn(
        "customer",
        new TableColumn({
          name: "source",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("customer", "middle_name");
    await queryRunner.dropColumn("customer", "full_name");
    await queryRunner.dropColumn("customer", "gender");
    await queryRunner.dropColumn("customer", "dob");
    await queryRunner.dropColumn("customer", "source");
    await queryRunner.dropColumn("customer", "membership_code");
  }
}
