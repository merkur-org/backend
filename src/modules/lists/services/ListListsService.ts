import { injectable, inject } from 'tsyringe';

import IListsRepository from '../repositories/IListsRepository';
import IPaginatedListsDTO from '../dtos/IPaginatedListsDTO';
import IPaginationListsDTO from '../dtos/IPaginationListsDTO';

@injectable()
class ListListsService {
  constructor(
    @inject('ListsRepository')
    private listsRepository: IListsRepository,
  ) {}

  public async execute({
    limit,
    page,
    order,
    sort_by,
    ...filter
  }: IPaginationListsDTO): Promise<IPaginatedListsDTO> {
    const response = await this.listsRepository.findAllPaginated({
      limit,
      page,
      order,
      sort_by,
      ...filter,
    });

    return response;
  }
}

export default ListListsService;
