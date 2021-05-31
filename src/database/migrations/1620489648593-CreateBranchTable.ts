import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateBranchTable1620489648593 implements MigrationInterface {
  private tableForeignKey = new TableForeignKey({
    name: "fk_tbl_branch_tbl_brand_foreignKey",
    columnNames: ["brand_id"],
    referencedColumnNames: ["brand_id"],
    referencedTableName: "brand",
    onDelete: "CASCADE",
  });
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: "branch",
      columns: [
        {
          name: "branch_id",
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
    const ifExsist = await queryRunner.hasTable("branch");
    if (!ifExsist) {
      await queryRunner.createTable(table);
    }
    const ifDataExsist = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("brand_id") !== -1
    );
    if (!ifDataExsist) {
      await queryRunner.createForeignKey(table, this.tableForeignKey);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("branch", true);
  }
}
