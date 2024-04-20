import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1713586269476 implements MigrationInterface {
    name = 'migrations1713586269476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`did\` varchar(512) NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD UNIQUE INDEX \`IDX_7a029ddd18d2b4114bc998e89f\` (\`did\`)`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`public_address\` varchar(512) NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD UNIQUE INDEX \`IDX_b8e67adf6702d734568d9cde91\` (\`public_address\`)`);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`magic_link_id\``);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`magic_link_id\` varchar(512) NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD UNIQUE INDEX \`IDX_d31b6e2231ec3d475030727f0b\` (\`magic_link_id\`)`);
        await queryRunner.query(`ALTER TABLE \`apikeys\` ADD CONSTRAINT \`FK_efca1af520b8a080916e943c740\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`apikeys\` DROP FOREIGN KEY \`FK_efca1af520b8a080916e943c740\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP INDEX \`IDX_d31b6e2231ec3d475030727f0b\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`magic_link_id\``);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`magic_link_id\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP INDEX \`IDX_b8e67adf6702d734568d9cde91\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`public_address\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP INDEX \`IDX_7a029ddd18d2b4114bc998e89f\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`did\``);
    }

}
