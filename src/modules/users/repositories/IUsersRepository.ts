import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IPaginatedUsersDTO from '../dtos/IPaginatedUsersDTO';
import IPaginationUsersDTO from '../dtos/IPaginationUsersDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  checkUserExists(
    email: string,
    cpf?: string,
    cnpj?: string,
  ): Promise<User | undefined>;
  findByCPF(email: string): Promise<User | undefined>;
  findByCNPJ(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  save(user: User): Promise<User>;
  findAllPaginated(data: IPaginationUsersDTO): Promise<IPaginatedUsersDTO>;
}
