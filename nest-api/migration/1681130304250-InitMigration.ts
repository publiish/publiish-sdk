import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1681130304250 implements MigrationInterface {
  name = 'InitMigration1681130304250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`ipfs_upload\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(100) NOT NULL, \`new_filename\` varchar(255) NULL, \`file_type\` varchar(100) NOT NULL, \`cid\` varchar(200) NOT NULL, \`file_size\` int NULL, \`brand_id\` int NOT NULL, \`consumer_id\` int NOT NULL, \`created_by\` int NOT NULL, \`updated_by\` int NOT NULL, \`delete_flag\` tinyint NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`ipfs_upload\``);
  }
}
