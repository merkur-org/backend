import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

import IPaginatedUsersDTO from '../dtos/IPaginatedUsersDTO';
import IPaginationUsersDTO from '../dtos/IPaginationUsersDTO';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    limit,
    page,
    sort_by,
    order,
    ...filter
  }: IPaginationUsersDTO): Promise<IPaginatedUsersDTO> {
    const response = await this.usersRepository.findAllPaginated({
      limit,
      page,
      sort_by,
      order,
      ...filter,
    });

    return response;
  }
}
export default ListUsersService;
