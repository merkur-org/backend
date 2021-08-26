import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class addProducerIdToList1629946449610
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lists',
      new TableColumn({
        name: 'producer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'lists',
      new TableForeignKey({
        name: 'ProducerList',
        columnNames: ['producer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lists',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('lists', 'OrderList');

    await queryRunner.dropColumn('lists', 'producer_id');
  }
}
