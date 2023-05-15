import { MigrationInterface, QueryRunner } from "typeorm";

export class SubDomainColumn1681824058934 implements MigrationInterface {
    name = 'SubDomainColumn1681824058934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`sub_domain\` varchar(200) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`sub_domain\``);
    }

}
