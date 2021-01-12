import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

import IPaginationDTO from '../../../shared/dtos/IPaginationDTO';
import PaginatedUsersDTO from '../dtos/PaginatedUsersDTO';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    limit,
    page,
  }: IPaginationDTO): Promise<PaginatedUsersDTO> {
    const response = await this.usersRepository.findAllPaginated({
      limit,
      page,
    });

    return response;
  }
}
export default ListUsersService;
