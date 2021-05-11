import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateTriggers1620694873624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION unit_price_in_order_detail_update() RETURNS TRIGGER AS $unit_price_in_order_detail_update$
        begin
            update order_details
            set unit_price = (select lod.unit_price from list_offers_details lod
          join products p on lod.product_id = new.product_id
          join lists l on now() between l.created_at and l.end_date
          limit 1)
            where id = new.id;
          return new;
        END;
      $unit_price_in_order_detail_update$ LANGUAGE plpgsql;


      CREATE TRIGGER tg_unit_price_in_order_detail_update after INSERT ON order_details
      FOR EACH ROW EXECUTE PROCEDURE unit_price_in_order_detail_update();

      CREATE OR REPLACE FUNCTION stock_update() RETURNS TRIGGER AS $stock_update$
      declare
        var_list_offer_id uuid;
      begin
        select lod.id into var_list_offer_id from list_offers_details lod
        join products p on lod.product_id = new.product_id
        join lists l on now() between l.created_at and l.end_date;

          IF(TG_OP = 'UPDATE' or TG_OP = 'INSERT') THEN
              update list_offers_details
              set quantity_stock = (select quantity_stock from list_offers_details lod where lod.id = var_list_offer_id) - new.quantity
              where id = var_list_offer_id;
          return new;
          END IF;

          IF(TG_OP = 'DELETE') THEN
              update list_offers_details
              set quantity_stock = (select quantity_stock from list_offers_details lod where lod.id = var_list_offer_id) + old.quantity_stock
              where id = var_list_offer_id;
          return new;
          END IF;
      END;
      $stock_update$ LANGUAGE plpgsql;

      CREATE TRIGGER tg_stock_update after INSERT OR UPDATE OR DELETE ON order_details
      FOR EACH ROW EXECUTE PROCEDURE stock_update();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop trigger if exists tg_unit_price_in_order_detail_update on order_details cascade;
      drop function if exists unit_price_in_order_detail_update;
      drop trigger if exists tg_stock_update on order_details cascade;
      drop function if exists stock_update;
    `);
  }
}
