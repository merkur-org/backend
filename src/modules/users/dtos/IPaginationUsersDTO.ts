import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import ISort from '@shared/dtos/ISort';

interface IFilter {
  email?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  role?: string;
}

export default interface IPaginationUsersDTO
  extends IPaginationDTO,
    IFilter,
    ISort {}
