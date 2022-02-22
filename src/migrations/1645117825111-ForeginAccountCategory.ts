import {MigrationInterface, QueryRunner} from "typeorm";

export class ForeginAccountCategory1645117825111 implements MigrationInterface {
    name = 'ForeginAccountCategory1645117825111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_8e3bcf3d6dec78d095b493d9573"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_8e3bcf3d6dec78d095b493d9573" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_8e3bcf3d6dec78d095b493d9573"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_8e3bcf3d6dec78d095b493d9573" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
