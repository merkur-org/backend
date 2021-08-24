import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ISort from '@shared/dtos/ISort';

interface IFilter {
  payment_type?: string;
  payment_status?: string;
  sales_type?: string;
  delivery_point_id?: string;
  user_id?: string;
  date?: string;
}

export default interface IPaginationOrdersDTO
  extends IPaginationDTO,
    IFilter,
    ISort {
  start_date?: string;
  end_date?: string;
}
