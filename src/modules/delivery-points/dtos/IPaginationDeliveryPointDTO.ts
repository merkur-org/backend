import IPaginationDTO from '@shared/dtos/IPaginationDTO';

export default interface IPaginationDeliveryPointDTO extends IPaginationDTO {
  state?: string;
  sort_by?: string;
  order?: 'ASC' | 'DESC';
  city?: string;
  suburb?: string;
  street?: string;
  email?: string;
}
