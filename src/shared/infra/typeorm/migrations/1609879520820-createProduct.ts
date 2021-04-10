import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createProduct1609879520820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'unit',
            type: 'enum',
            enum: ['kg', 'g', 'l', 'ml', 'un', 'ton'],
          },
          {
            name: 'cost_price',
            type: 'float',
          },
          {
            name: 'sale_price',
            type: 'float',
          },
          {
            name: 'wholesale_price',
            type: 'float',
            isNullable: true,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
