import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateMembershipTable1622662885011 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "membership",
            columns: [
            {
                name: "membership_id",
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
                name: "description",
                type: "Text",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_one_purchase",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_private",
                type: "boolean",
                isPrimary: false,
                isNullable: true,
            },
            {
                name: "is_trial",
                type: "boolean",
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

        const ifExsist = await queryRunner.hasTable("membership");
        if (!ifExsist) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("membership", true);
    }
}
