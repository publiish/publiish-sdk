import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1712774109844 implements MigrationInterface {
    name = 'migrations1712774109844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`apikeys\` (\`id\` varchar(36) NOT NULL, \`apikey\` varchar(200) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isDefault\` tinyint NOT NULL DEFAULT 0, \`storageSize\` int UNSIGNED NULL, \`write_permission\` tinyint NOT NULL DEFAULT 1, \`delete_permission\` tinyint NOT NULL DEFAULT 1, \`brandId\` int NOT NULL, \`expireAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_fac8aaa5550a80ca6c417f2759\` (\`apikey\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD UNIQUE INDEX \`IDX_033cf975080434707f2665ed7f\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`apikeys\` ADD CONSTRAINT \`FK_efca1af520b8a080916e943c740\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`apikeys\` DROP FOREIGN KEY \`FK_efca1af520b8a080916e943c740\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP INDEX \`IDX_033cf975080434707f2665ed7f\``);
        await queryRunner.query(`DROP INDEX \`IDX_fac8aaa5550a80ca6c417f2759\` ON \`apikeys\``);
        await queryRunner.query(`DROP TABLE \`apikeys\``);
    }

}
