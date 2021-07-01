import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateCustomerPaymentToken1624818869971 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_customer_payment_token_tbl_customer_foreignKey",
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE",
    });

    private tableForeignKey1 = new TableForeignKey({
        name: "fk_tbl_customer_payment_token_tbl_payment_gateway_foreignKey",
        columnNames: ["payment_gateway_id"],
        referencedColumnNames: ["payment_gateway_id"],
        referencedTableName: "payment_gateway",
        onDelete: "CASCADE",
    });

    private tableForeignKey2 = new TableForeignKey({
        name: "fk_tbl_customer_payment_token_tbl_branch_foreignKey",
        columnNames: ["branch_id"],
        referencedColumnNames: ["branch_id"],
        referencedTableName: "branch",
        onDelete: "CASCADE",
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "customer_payment_token",
            columns: [
                {
                    name: "customer_payment_token_id",
                    type: "integer",
                    length: "11",
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "customer_id",
                    type: "integer",
                    length: "11",
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: "payment_gateway_id",
                    type: "integer",
                    length: "11",
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: "branch_id",
                    type: "integer",
                    length: "11",
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: "token",
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
        const ifExsist = await queryRunner.hasTable("customer_payment_token");
        if (!ifExsist) {
            await queryRunner.createTable(table);
        }
        const ifDataExsist = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("customer_id") !== -1
        );
        if (!ifDataExsist) {
            await queryRunner.createForeignKey(table, this.tableForeignKey);
        }
        const ifDataExsist1 = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("payment_gateway_id") !== -1
        );
        if (!ifDataExsist1) {
            await queryRunner.createForeignKey(table, this.tableForeignKey1);
        }
        const ifDataExsist2 = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("branch_id") !== -1
        );
        if (!ifDataExsist2) {
            await queryRunner.createForeignKey(table, this.tableForeignKey2);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.dropTable("customer_payment_token", true);
    }

}
