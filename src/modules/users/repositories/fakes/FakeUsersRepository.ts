import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import PaginationDTO from '@modules/users/dtos/PaginationDTO';
import PaginatedUsersDTO from '@modules/users/dtos/PaginatedUsersDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async checkUserExists(
    email: string,
    cpf: string,
    cnpj: string,
  ): Promise<User | undefined> {
    const findUser = this.users.find(
      user => user.email === email || user.cpf === cpf || user.cnpj === cnpj,
    );

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findByCPF(cpf: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.cpf === cpf);

    return findUser;
  }

  public async findByCNPJ(cnpj: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.cnpj === cnpj);

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async delete(id: string): Promise<void> {
    this.users.filter(user => user.id !== id);
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async findAllPaginated({
    page = 1,
    limit = 10,
  }: PaginationDTO): Promise<PaginatedUsersDTO> {
    const skippedItems = (page - 1) * limit;

    const totalCount = this.users.length;
    const users: User[] = [];

    let i = skippedItems;

    const limitLoop =
      skippedItems + limit < totalCount ? skippedItems + limit : totalCount - 1;

    console.log('iii', i, 'limiteee', limitLoop);

    if (i === 0 && limitLoop === 0 && this.users[0]) {
      users.push(this.users[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      users.push(this.users[i]);
    }

    return {
      totalCount,
      page,
      limit,
      data: users,
    };
  }
}

export default FakeUsersRepository;
