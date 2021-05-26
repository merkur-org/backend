import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IPaginatedUsersDTO from '@modules/users/dtos/IPaginatedUsersDTO';
import IPaginationUsersDTO from '@modules/users/dtos/IPaginationUsersDTO';
import { mountQueryWhere } from '@shared/utils/helpers';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async checkUserExists(
    email: string,
    cpf: string,
    cnpj: string,
  ): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: [{ email }, { cpf }, { cnpj }],
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findByCPF(cpf: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { cpf },
    });

    return user;
  }

  public async findByCNPJ(cnpj: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { cnpj },
    });

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findAllPaginated({
    limit,
    page,
    sort_by,
    order,
    ...filter
  }: IPaginationUsersDTO): Promise<IPaginatedUsersDTO> {
    const skipped_items = (page - 1) * limit;

    const queryWhere = mountQueryWhere(filter, 'user');

    const [users, total_count] = await this.ormRepository
      .createQueryBuilder('user')
      .where(queryWhere)
      .orderBy(`user.${sort_by || 'created_at'}`, order)
      .offset(skipped_items)
      .limit(limit)
      .getManyAndCount();

    return {
      total_count,
      page,
      limit,
      data: users,
    };
  }
}

export default UsersRepository;
