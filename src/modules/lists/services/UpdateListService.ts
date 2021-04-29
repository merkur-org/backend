import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IListsRepository from '../repositories/IListsRepository';
import IListProducersDetailsRepository from '../repositories/IListProducersDetailsRepository';
import IListOffersDetailsRepository from '../repositories/IListOffersDetailsRepository';
import ICreateListDTO from '../dtos/ICreateListDTO';
import List from '../infra/typeorm/entities/List';
import ListOffersDetail from '../infra/typeorm/entities/ListOffersDetail';
import ListProducersDetail from '../infra/typeorm/entities/ListProducersDetail';

interface IRequest extends ICreateListDTO {
  details: ListOffersDetail[] | ListProducersDetail[];
  list_id: string;
}

interface IResponse {
  list: List;

  details: ListOffersDetail[] | ListProducersDetail[];
}

@injectable()
class UpdateListService {
  constructor(
    @inject('ListsRepository')
    private listsRepository: IListsRepository,

    @inject('ListProducersDetailsRepository')
    private listProducersDetailsRepository: IListProducersDetailsRepository,

    @inject('ListOffersDetailsRepository')
    private listOffersDetailsRepository: IListOffersDetailsRepository,
  ) {}

  public async execute({
    list_id,
    details,
    start_date,
    end_date,
    status,
  }: IRequest): Promise<IResponse> {
    const list = await this.listsRepository.findById(list_id);

    if (!list) {
      throw new AppError('List not found', 404);
    }

    list.start_date = start_date || list.start_date;
    list.end_date = end_date || list.end_date;
    list.status = status || list.status;
    list.created_at = new Date();

    await this.listsRepository.save(list);
    let listDetails: ListOffersDetail[] | ListProducersDetail[];

    if (list.type === 'offer') {
      const listAux = (await this.listOffersDetailsRepository.findByListId(
        list_id,
      )) as ListOffersDetail[];

      const detailsType = details as ListOffersDetail[];

      detailsType.forEach(detail => {
        const detailIndex = listAux.findIndex(() => detail.id);

        if (detailIndex !== -1) {
          listAux[detailIndex].quantity = detail.quantity;
          listAux[detailIndex].unit_price = detail.unit_price;
          listAux[detailIndex].updated_at = new Date();
        }
      });
      await this.listOffersDetailsRepository.save(listAux);

      listDetails = listAux;
    } else {
      const listAux = await this.listProducersDetailsRepository.findByListId(
        list_id,
      );

      const detailsType = details as ListProducersDetail[];

      detailsType.forEach(detail => {
        const detailIndex = listDetails.findIndex(() => detail.id);

        if (detailIndex !== -1) {
          listAux[detailIndex].due_date = detail.due_date;
          listAux[detailIndex].lot = detail.lot;
          listAux[detailIndex].quantity = detail.quantity;
          listAux[detailIndex].unit_price = detail.unit_price;
          listAux[detailIndex].unit_price = detail.unit_price;
          listAux[detailIndex].discount = detail.discount;
          listAux[detailIndex].total_price = detail.total_price;
          listAux[detailIndex].updated_at = new Date();
        }
      });
      await this.listProducersDetailsRepository.save(listAux);

      listDetails = listAux;
    }

    return {
      list,
      details: listDetails,
    };
  }
}

export default UpdateListService;
