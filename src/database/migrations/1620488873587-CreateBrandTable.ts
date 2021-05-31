import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBrandTable1620488873587 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: "brand",
      columns: [
        {
          name: "brand_id",
          type: "integer",
          length: "11",
          isPrimary: true,
          isNullable: false,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "name",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "email",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "logo",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "logo_path",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "image",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "image_path",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "legal_name",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "phone",
          type: "varchar",
          length: "255",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "is_active",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "created_by",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "created_by_type",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "modified_by",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "modified_by_type",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "created_date",
          type: "datetime",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "modified_date",
          type: "datetime",
          isPrimary: false,
          isNullable: true,
        },
      ],
    });
    const ifExsist = await queryRunner.hasTable("brand");
    if (!ifExsist) {
      await queryRunner.createTable(table);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("brand", true);
  }
}
