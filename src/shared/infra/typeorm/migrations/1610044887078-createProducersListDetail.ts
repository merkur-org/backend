import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createProducersListDetail1610039989598
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'list_producers_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'list_id',
            type: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'due_date',
            type: 'timestamp with time zone',
          },
          {
            name: 'lot',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'unit_price',
            type: 'float',
          },
          {
            name: 'discount',
            type: 'float',
          },
          {
            name: 'total_price',
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
            name: 'ListProducersDetailList',
            referencedTableName: 'lists',
            referencedColumnNames: ['id'],
            columnNames: ['list_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ListProducersDetailProduct',
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            columnNames: ['product_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('list_producers_details');
  }
}
