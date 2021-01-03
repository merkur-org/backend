import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

import PaginationDTO from '../dtos/PaginationDTO';
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
  }: PaginationDTO): Promise<PaginatedUsersDTO> {
    const response = await this.usersRepository.findAllPaginated({
      limit,
      page,
    });

    console.log('resposta caraio', response);

    return response;
  }
}
export default ListUsersService;
