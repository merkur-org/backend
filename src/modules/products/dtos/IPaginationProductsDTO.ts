import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ISort from '@shared/dtos/ISort';

interface IFilter {
  name?: string;
  unit_sale?: string;
  category?: string;
  unit_buy?: string;
  fraction_buy?: number;
  fraction_sale?: number;
  organic?: boolean;
  highlights?: boolean;
}

export default interface IPaginationProductsDTO
  extends IPaginationDTO,
    IFilter,
    ISort {}
