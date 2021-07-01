import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreatePaymentGateway1624636472975 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_payment_gateway_tbl_country_foreignKey",
        columnNames: ["country_id"],
        referencedColumnNames: ["country_id"],
        referencedTableName: "country",
        onDelete: "CASCADE",
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: "payment_gateway",
            columns: [
                {
                    name: "payment_gateway_id",
                    type: "integer",
                    length: "11",
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "country_id",
                    type: "integer",
                    length: "11",
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "11",
                    isPrimary: false,
                    isNullable: true,
                },
            ],
        });
        const ifExsist = await queryRunner.hasTable("payment_gateway");
        if (!ifExsist) {
            await queryRunner.createTable(table);
        }
        const ifDataExsist = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("country_id") !== -1
        );
        if (!ifDataExsist) {
            await queryRunner.createForeignKey(table, this.tableForeignKey);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("payment_gateway", true);
    }

}
