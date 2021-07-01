import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from 'typeorm';

export class AlterBranchTable1624634133995 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: "fk_tbl_branch_tbl_country_foreignKey",
        columnNames: ["country_id"],
        referencedColumnNames: ["country_id"],
        referencedTableName: "country",
        onDelete: "CASCADE",
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        const ifExist = await queryRunner.hasColumn("branch", "country_id");
        if (!ifExist) {
            await queryRunner.addColumn(
                "branch",
                new TableColumn({
                name: "country_id",
                type: "integer",
                length: "11",
                isPrimary: false,
                isNullable: true,
                })
            );
        }
        const table = await queryRunner.getTable('branch');
        const ifDataExsist = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("country_id") !== -1
        );
        if (!ifDataExsist) {
            await queryRunner.createForeignKey(table, this.tableForeignKey);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("branch", "country_id");
    }

}
