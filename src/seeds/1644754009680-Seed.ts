import {MigrationInterface, QueryRunner} from "typeorm";

export class Seed1644754009680 implements MigrationInterface {
    name = 'Seed1644754009680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`INSERT INTO categories (name, rule, weight) VALUES ('Тестовая категория', 'skins:>20', '1')`);
        await queryRunner.query(`INSERT INTO users (login, username, password) VALUES ('ronvel', 'Ronvel', '$2b$10$dBH2NqAxiGiwGoxL7iHd1.2nCHR1zl2Bk7kYVkVmo4.sURwyAkIEi')`);
        // await queryRunner.query(`INSERT INTO accounts (info, "categoryId") VALUES ('{"game":"Valorant","account":{"login":"TTvcammini44","password":"a7JrheUO2129","username":"dryss#lol","region":{"index":"NA","country":"USA"},"lastMatch":1638046800000,"rank":["GOLD 1","EPISODE 3","ACT 3"],"skinCount":"98","skins":["Singularity","Phantom","Level","6"]}}', '1')`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
