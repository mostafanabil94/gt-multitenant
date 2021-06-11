import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateMembershipPlanTable1622662941982 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_membership_plan_tbl_membership_foreignKey",
        columnNames: ["membership_id"],
        referencedColumnNames: ["membership_id"],
        referencedTableName: "membership",
        onDelete: "CASCADE",
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "membership_plan",
            columns: [
            {
                name: "membership_plan_id",
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
                name: "membership_id",
                type: "integer",
                length: "11",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_multiple_clients",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "max_number_of_clients",
                type: "integer",
                length: "11",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "type",
                type: "integer",
                length: "11",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "price",
                type: 'DECIMAL(15,2)',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "period_type",
                type: 'integer',
                length: '11',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "for_period",
                type: 'integer',
                length: '11',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "every_period",
                type: 'integer',
                length: '11',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_start_month",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_free_period",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_prorate",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_ending_period",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "end_period",
                type: "integer",
                length: '11',
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_autorenew",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_joining_fee",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "joining_fee",
                type: 'DECIMAL(15,2)',
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

        const ifExsist = await queryRunner.hasTable("membership_plan");
        if (!ifExsist) {
            await queryRunner.createTable(table);
        }
        const ifDataExsist = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("membership_id") !== -1
        );
        if (!ifDataExsist) {
            await queryRunner.createForeignKey(table, this.tableForeignKey);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("membership_plan", true);
    }
}
