import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ISort from '@shared/dtos/ISort';

interface IFilter {
  user_id?: string;
  type?: string;
}

export default interface IPaginationListsDTO
  extends IPaginationDTO,
    IFilter,
    ISort {}
