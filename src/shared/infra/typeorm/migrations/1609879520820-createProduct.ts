import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

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
            name: 'nutritional_information',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observation',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'cost_price',
            type: 'float',
          },
          {
            name: 'organic',
            type: 'boolean',
            default: true,
          },
          {
            name: 'unit_sale',
            type: 'enum',
            enum: ['kg', 'g', 'l', 'ml', 'un', 'box', 'bag', 'ton'],
          },
          {
            name: 'unit_buy',
            type: 'enum',
            enum: ['kg', 'g', 'l', 'ml', 'un', 'box', 'bag', 'ton'],
          },
          {
            name: 'fraction_buy',
            type: 'float',
          },
          {
            name: 'fraction_sale',
            type: 'float',
          },
          {
            name: 'highlights',
            type: 'boolean',
            default: false,
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

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'products_name_search',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('products', 'products_name_search');
    await queryRunner.dropTable('products');
  }
}
