import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateClientMembershipPlanTable1624230413004 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_client_membership_plan_tbl_customer_foreignKey",
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE",
    });
    private tableForeignKey1 = new TableForeignKey({
        name: "fk_tbl_client_membership_plan_tbl_membership_plan_foreignKey",
        columnNames: ["membership_plan_id"],
        referencedColumnNames: ["membership_plan_id"],
        referencedTableName: "membership_plan",
        onDelete: "CASCADE",
    });
    private tableForeignKey2 = new TableForeignKey({
        name: "fk_tbl_client_membership_plan_tbl_sales_foreignKey",
        columnNames: ["sales_id"],
        referencedColumnNames: ["user_id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
    });
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "client_membership_plan",
            columns: [
            {
                name: "client_membership_plan_id",
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
                name: "membership_plan_id",
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
                name: "start_date",
                type: "varchar",
                length: "255",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "end_date",
                type: "varchar",
                length: "255",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "price",
                type: "DECIMAL(15,2)",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "total_paid",
                type: "DECIMAL(15,2)",
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
        const ifExsist = await queryRunner.hasTable("client_membership_plan");
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
            (fk) => fk.columnNames.indexOf("membership_plan_id") !== -1
        );
        if (!ifDataExsist1) {
            await queryRunner.createForeignKey(table, this.tableForeignKey1);
        }
        const ifDataExsist2 = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("sales_id") !== -1
        );
        if (!ifDataExsist2) {
            await queryRunner.createForeignKey(table, this.tableForeignKey2);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("client_membership_plan", true);
    }

}
