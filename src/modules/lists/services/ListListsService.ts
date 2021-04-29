import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IListsRepository from '../repositories/IListsRepository';
import IPaginatedListsDTO from '../dtos/IPaginatedListsDTO';
import { TList } from '../infra/typeorm/entities/List';

interface IRequest extends IPaginationDTO {
  type: TList;
  user_id?: string;
}

@injectable()
class ListListsService {
  constructor(
    @inject('ListsRepository')
    private listsRepository: IListsRepository,
  ) {}

  public async execute({
    user_id,
    limit,
    page,
    type,
  }: IRequest): Promise<IPaginatedListsDTO> {
    const response = await this.listsRepository.findAllPaginated(
      { limit, page },
      type,
      user_id,
    );

    return response;
  }
}

export default ListListsService;
