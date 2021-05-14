import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateTriggers1620694873624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_stock_and_unit_price() RETURNS TRIGGER AS $update_stock_and_unit_price$
        declare
          var_list_offer_id uuid;
        begin
          select lod.id into var_list_offer_id from list_offers_details lod
          join products p on lod.product_id = new.product_id
          join lists l on now() between l.created_at and l.end_date
          where l.type = 'offer';

        IF(TG_OP = 'INSERT') then
          update order_details
          set unit_price = (select lod.unit_price from list_offers_details lod
        join products p on lod.product_id = new.product_id
        join lists l on now() between l.created_at and l.end_date
        limit 1)
          where id = new.id;
        return new;
        end if;
          IF(TG_OP = 'UPDATE' or TG_OP = 'INSERT') THEN
              update list_offers_details
              set quantity_stock = (select quantity_stock from list_offers_details lod where lod.id = var_list_offer_id) - new.quantity
              where id = var_list_offer_id;
          return new;
          END IF;

              IF(TG_OP = 'DELETE') then
                  update list_offers_details
                  set quantity_stock = (select quantity_stock from list_offers_details lod where lod.id = var_list_offer_id) + old.quantity_stock
                  where id = var_list_offer_id;
              return new;
              END IF;
          END;
      $update_stock_and_unit_price$ LANGUAGE plpgsql;

      CREATE TRIGGER tg_update_stock_and_unit_price after INSERT OR UPDATE OR DELETE ON order_details
      FOR EACH ROW EXECUTE PROCEDURE update_stock_and_unit_price();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop trigger if exists tg_update_stock_and_unit_price on order_details cascade;
      drop function if exists update_stock_and_unit_price;
    `);
  }
}
