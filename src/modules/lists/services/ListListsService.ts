import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IListsReposiroty from '../repositories/IListsReposiroty';
import IPaginatedListsDTO from '../dtos/IPaginatedListsDTO';

interface IRequest extends IPaginationDTO {
  user_id?: string;
}

@injectable()
class ListListsService {
  constructor(
    @inject('ListsReposiroty')
    private listsReposiroty: IListsReposiroty,
  ) {}

  public async execute({
    user_id,
    limit,
    page,
  }: IRequest): Promise<IPaginatedListsDTO> {
    const response = await this.listsReposiroty.findAllPaginated(
      { limit, page },
      user_id,
    );

    return response;
  }
}

export default ListListsService;
