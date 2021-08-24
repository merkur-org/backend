import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICreateListDTO from '../dtos/ICreateListDTO';
import ListOffersDetail from '../infra/typeorm/entities/ListOffersDetail';
import ListProducersDetail from '../infra/typeorm/entities/ListProducersDetail';
import List from '../infra/typeorm/entities/List';
import IListProducersDetailsRepository from '../repositories/IListProducersDetailsRepository';
import IListOffersDetailsRepository from '../repositories/IListOffersDetailsRepository';
import IListsRepository from '../repositories/IListsRepository';

type ICreateListOffers = {
  product_id: string;
  quantity_total: number;
  quantity_stock: number;
  unit_price: number;
  sale_price: number;
};
type ICreateListProducers = {
  product_id: string;
  quantity: number;
  unit_price: number;
  due_date: Date;
  discount: number;
  total_price: number;
  lot?: string;
};

interface IRequest extends ICreateListDTO {
  details: ICreateListProducers[] | ICreateListOffers[];
}

interface IResponse {
  list: List;
  details: ListOffersDetail[] | ListProducersDetail[];
}
@injectable()
class CreateDeliveryPointService {
  constructor(
    @inject('ListsRepository')
    private listsRepository: IListsRepository,

    @inject('ListProducersDetailsRepository')
    private listProducersDetailsRepository: IListProducersDetailsRepository,

    @inject('ListOffersDetailsRepository')
    private listOffersDetailsRepository: IListOffersDetailsRepository,
  ) {}

  public async execute({
    details,
    start_date,
    end_date,
    user_id,
    status,
    type,
  }: IRequest): Promise<IResponse> {
    if (type === 'offer') {
      const ExistsListActive = await this.listsRepository.findBetweenStartAndEndDate(
        { limit: 1, page: 1 },
        type,
        start_date,
        end_date,
      );

      if (ExistsListActive.data.length > 0) {
        throw new AppError('Can only have one active offer registered', 400);
      }
    }

    const list = await this.listsRepository.create({
      start_date,
      end_date,
      type,
      user_id,
      status,
    });

    let detailsResponse: ListOffersDetail[] | ListProducersDetail[];
    if (type === 'offer') {
      const detailsType = details as ICreateListOffers[];

      const serializedProducts = detailsType.map(detail => {
        return {
          ...detail,
          quantity_stock: detail.quantity_stock || detail.quantity_total,
          list_id: list.id,
        } as ListOffersDetail;
      });
      detailsResponse = await this.listOffersDetailsRepository.create(
        serializedProducts,
      );
    } else {
      const detailsType = details as ICreateListProducers[];

      const serializedProducts = detailsType.map(detail => {
        return {
          ...detail,
          list_id: list.id,
        };
      });

      detailsResponse = await this.listProducersDetailsRepository.create(
        serializedProducts,
      );
    }

    return {
      list,
      details: detailsResponse,
    };
  }
}

export default CreateDeliveryPointService;
