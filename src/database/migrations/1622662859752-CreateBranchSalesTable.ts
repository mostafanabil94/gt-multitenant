import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateBranchSalesTable1622662859752 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_branch_sales_tbl_branch_foreignKey",
        columnNames: ["branch_id"],
        referencedColumnNames: ["branch_id"],
        referencedTableName: "branch",
        onDelete: "CASCADE",
    });
    private tableForeignKey1 = new TableForeignKey({
        name: "fk_tbl_branch_sales_tbl_sales_foreignKey",
        columnNames: ["sales_id"],
        referencedColumnNames: ["sales_id"],
        referencedTableName: "sales",
        onDelete: "CASCADE",
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "branch_sales",
            columns: [
            {
                name: "branch_sales_id",
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
                name: "sales_id",
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

        const ifExsist = await queryRunner.hasTable("branch_sales");
        if (!ifExsist) {
            await queryRunner.createTable(table);
        }
        const ifDataExsist = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("branch_id") !== -1
        );
        if (!ifDataExsist) {
            await queryRunner.createForeignKey(table, this.tableForeignKey);
        }
        const ifDataExsist1 = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("sales_id") !== -1
        );
        if (!ifDataExsist1) {
            await queryRunner.createForeignKey(table, this.tableForeignKey1);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("branch_sales", true);
    }
}
