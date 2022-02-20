import {MigrationInterface, QueryRunner} from "typeorm";

export class AccountsCreate1645103304438 implements MigrationInterface {
    name = 'AccountsCreate1645103304438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "categoryId" integer, "info" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_8e3bcf3d6dec78d095b493d9573" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_8e3bcf3d6dec78d095b493d9573"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
