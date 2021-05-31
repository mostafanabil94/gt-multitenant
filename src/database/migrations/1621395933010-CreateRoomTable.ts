import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateRoomTable1621395933010 implements MigrationInterface {
  private tableForeignKey = new TableForeignKey({
    name: "fk_tbl_room_tbl_branch_foreignKey",
    columnNames: ["branch_id"],
    referencedColumnNames: ["branch_id"],
    referencedTableName: "branch",
    onDelete: "CASCADE",
  });
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: "room",
      columns: [
        {
          name: "room_id",
          type: "integer",
          length: "11",
          isPrimary: true,
          isNullable: false,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "branch_id",
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
    const ifExsist = await queryRunner.hasTable("room");
    if (!ifExsist) {
      await queryRunner.createTable(table);
    }
    const ifDataExsist = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("branch_id") !== -1
    );
    if (!ifDataExsist) {
      await queryRunner.createForeignKey(table, this.tableForeignKey);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("room", true);
  }
}
