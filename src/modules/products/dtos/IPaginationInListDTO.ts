import { TList } from '@modules/lists/infra/typeorm/entities/List';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';

export default interface IPaginationInListDTO extends IPaginationDTO {
  type: TList;
  date: Date;
}
