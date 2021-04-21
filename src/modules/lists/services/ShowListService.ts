import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IListsReposiroty from '../repositories/IListsReposiroty';
import List from '../infra/typeorm/entities/List';
import ListOffersDetail from '../infra/typeorm/entities/ListOffersDetail';
import ListProducersDetail from '../infra/typeorm/entities/ListProducersDetail';
import IListProducersDetailsRepository from '../repositories/IListProducersDetailsRepository';
import IListOffersDetailsRepository from '../repositories/IListOffersDetailsRepository';

interface IRequest {
  list_id: string;
}

interface IResponse {
  list: List;
  details: ListOffersDetail[] | ListProducersDetail[];
}

@injectable()
class ShowListService {
  constructor(
    @inject('ListsReposiroty')
    private listsReposiroty: IListsReposiroty,

    @inject('ListProducersDetailsRepository')
    private listProducersDetailsRepository: IListProducersDetailsRepository,

    @inject('ListOffersDetailsRepository')
    private listOffersDetailsRepository: IListOffersDetailsRepository,
  ) {}

  public async execute({ list_id }: IRequest): Promise<IResponse> {
    const list = await this.listsReposiroty.findById(list_id);

    if (!list) {
      throw new AppError('Weekly List not found', 404);
    }

    let details: ListOffersDetail[] | ListProducersDetail[];

    if (list.type === 'offer') {
      details = await this.listOffersDetailsRepository.findByListId(list_id);
    } else {
      details = await this.listProducersDetailsRepository.findByListId(list_id);
    }

    return {
      list,
      details,
    };
  }
}

export default ShowListService;
