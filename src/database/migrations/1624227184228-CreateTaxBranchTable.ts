import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTaxBranchTable1624227184228 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_branch_tax_tbl_branch_foreignKey",
        columnNames: ["branch_id"],
        referencedColumnNames: ["branch_id"],
        referencedTableName: "branch",
        onDelete: "CASCADE",
    });
    private tableForeignKey1 = new TableForeignKey({
        name: "fk_tbl_branch_tax_tbl_tax_foreignKey",
        columnNames: ["tax_id"],
        referencedColumnNames: ["tax_id"],
        referencedTableName: "tax",
        onDelete: "CASCADE",
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "branch_tax",
            columns: [
            {
                name: "branch_tax_id",
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
                name: "tax_id",
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

        const ifExsist = await queryRunner.hasTable("branch_tax");
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
            (fk) => fk.columnNames.indexOf("tax_id") !== -1
        );
        if (!ifDataExsist1) {
            await queryRunner.createForeignKey(table, this.tableForeignKey1);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("branch_tax", true);
    }
}
