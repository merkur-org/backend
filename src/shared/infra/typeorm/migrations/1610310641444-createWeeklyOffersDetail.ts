import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createWeekOffer1610310641444
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'weekly_offer_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'offer_id',
            type: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'float',
          },
          {
            name: 'unit_price',
            type: 'float',
          },
          {
            name: 'sale_price',
            type: 'float',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'WeeklyOffersDetailList',
            referencedTableName: 'weekly_offers',
            referencedColumnNames: ['id'],
            columnNames: ['offer_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'WeeklyOffersDetailProduct',
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            columnNames: ['product_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('weekly_offer_details');
  }
}
