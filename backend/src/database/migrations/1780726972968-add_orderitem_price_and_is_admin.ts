import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderitemPriceAndIsAdmin1780726972968 implements MigrationInterface {
    name = 'AddOrderitemPriceAndIsAdmin1780726972968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_admin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_admin"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "price"`);
    }

}
