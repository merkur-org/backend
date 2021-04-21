import { injectable, inject } from 'tsyringe';
import ICreateListDTO from '../dtos/ICreateListDTO';
import ListOffersDetail from '../infra/typeorm/entities/ListOffersDetail';
import ListProducersDetail from '../infra/typeorm/entities/ListProducersDetail';
import List from '../infra/typeorm/entities/List';
import IListProducersDetailsRepository from '../repositories/IListProducersDetailsRepository';
import IListOffersDetailsRepository from '../repositories/IListOffersDetailsRepository';
import IListsReposiroty from '../repositories/IListsReposiroty';

type ICreateListOffers = {
  product_id: string;
  quantity: number;
  unit_price: number;
  sale_price: number;
};
type ICreateListProducers = {
  product_id: string;
  due_date: Date;
  quantity: number;
  unit_price: number;
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
    @inject('ListsReposiroty')
    private listsRepository: IListsReposiroty,

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
