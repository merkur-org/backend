import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedListsDTO from '../dtos/IPaginatedListsDTO';
import IListsRepository from '../repositories/IListsRepository';
import { TList } from '../infra/typeorm/entities/List';

interface IRequest extends IPaginationDTO {
  date?: Date;
  type: TList;
}

@injectable()
class ListListsActivePerDateService {
  constructor(
    @inject('ListsRepository')
    private listsRepository: IListsRepository,
  ) {}

  public async execute({
    limit,
    page,
    type,
    date = new Date(),
  }: IRequest): Promise<IPaginatedListsDTO> {
    const response = await this.listsRepository.findBetweenStartAndEndDate(
      {
        limit,
        page,
      },
      type,
      date,
    );

    return response;
  }
}

export default ListListsActivePerDateService;
