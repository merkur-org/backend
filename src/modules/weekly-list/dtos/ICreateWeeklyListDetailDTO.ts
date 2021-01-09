export default interface ICreateWeeklyListDetailDTO {
  list_id: string;
  product_id: string;
  due_date: Date;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
  lot?: string;
}
