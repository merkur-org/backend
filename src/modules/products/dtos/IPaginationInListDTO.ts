import { TList } from '@modules/lists/infra/typeorm/entities/List';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';

interface IFilter {
  name?: string;
  image?: string;
  nutritional_information?: string;
  observation?: string;
  unit_sale?: string;
  category?: string;
  unit_buy?: string;
  fraction_buy?: number;
  fraction_sale?: number;
  cost_price?: number;
  sale_price?: number;
  wholesale_price?: number;
  organic?: boolean;
  highlights?: boolean;
}

interface ISort {
  sort_by?: string;
  order?: 'ASC' | 'DESC';
}

export default interface IPaginationInListDTO
  extends IPaginationDTO,
    IFilter,
    ISort {
  type: TList;
  date: Date;
}
