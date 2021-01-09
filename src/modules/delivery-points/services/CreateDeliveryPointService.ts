import { injectable, inject } from 'tsyringe';
import ICreateDeliveryPointDTO from '../dtos/ICreateDeliveryPointDTO';
import DeliveryPoint from '../infra/typeorm/entities/DeliveryPoints';
import IDeliveryPointsRepository from '../repositories/IDeliveryPointsRepository';

@injectable()
class CreateDeliveryPointService {
  constructor(
    @inject('DeliveryPointsRepository')
    private deliveryPointRepository: IDeliveryPointsRepository,
  ) {}

  public async execute({
    cep,
    city,
    latitude,
    longitude,
    number,
    state,
    street,
    suburb,
  }: ICreateDeliveryPointDTO): Promise<DeliveryPoint> {
    const deliveryPoint = await this.deliveryPointRepository.create({
      cep,
      city,
      latitude,
      longitude,
      number,
      state,
      street,
      suburb,
    });

    return deliveryPoint;
  }
}

export default CreateDeliveryPointService;
