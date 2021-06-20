import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateBrandUserTable1621270531691 implements MigrationInterface {
  private tableForeignKey = new TableForeignKey({
    name: "fk_tbl_brand_user_tbl_brand_foreignKey",
    columnNames: ["brand_id"],
    referencedColumnNames: ["brand_id"],
    referencedTableName: "brand",
    onDelete: "CASCADE",
  });
  private tableForeignKey1 = new TableForeignKey({
    name: "fk_tbl_brand_user_tbl_user_foreignKey",
    columnNames: ["user_id"],
    referencedColumnNames: ["user_id"],
    referencedTableName: "users",
    onDelete: "CASCADE",
  });
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: "brand_user",
      columns: [
        {
          name: "brand_user_id",
          type: "integer",
          length: "11",
          isPrimary: true,
          isNullable: false,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "brand_id",
          type: "integer",
          length: "11",
          isPrimary: false,
          isNullable: true,
        },
        {
          name: "user_id",
          type: "integer",
          length: "11",
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
    const ifExsist = await queryRunner.hasTable("brand_user");
    if (!ifExsist) {
      await queryRunner.createTable(table);
    }
    const ifDataExsist = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("brand_id") !== -1
    );
    if (!ifDataExsist) {
      await queryRunner.createForeignKey(table, this.tableForeignKey);
    }
    const ifDataExsist1 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("brand_id") !== -1
    );
    if (!ifDataExsist1) {
      await queryRunner.createForeignKey(table, this.tableForeignKey1);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("brand_user", true);
  }
}
