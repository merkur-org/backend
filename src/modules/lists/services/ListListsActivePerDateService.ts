import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedListsDTO from '../dtos/IPaginatedListsDTO';
import IListsReposiroty from '../repositories/IListsReposiroty';

interface IRequest extends IPaginationDTO {
  date?: Date;
}

@injectable()
class ListListsActivePerDateService {
  constructor(
    @inject('ListsReposiroty')
    private listsReposiroty: IListsReposiroty,
  ) {}

  public async execute({
    limit,
    page,
    date = new Date(),
  }: IRequest): Promise<IPaginatedListsDTO> {
    const response = await this.listsReposiroty.findBetweenStartAndEndDate(
      {
        limit,
        page,
      },
      date,
    );

    return response;
  }
}

export default ListListsActivePerDateService;
