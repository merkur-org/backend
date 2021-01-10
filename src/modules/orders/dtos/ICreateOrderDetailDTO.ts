export default interface ICreateOrderDetailDTO {
  order_id: string;
  product_id: string;
  unit_price: number;
  quantity: number;
  discount: number;
}
