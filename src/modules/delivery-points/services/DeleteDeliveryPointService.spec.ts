import AppError from '@shared/errors/AppError';
import FakeDeliveryPointsRepository from '../repositories/fakes/FakeDeliveryPointsRepository';
import CreateDeliveryPointService from './CreateDeliveryPointService';
import DeleteDeliveryPointService from './DeleteDeliveryPointService';

let fakeDeliveryPointsRepository: FakeDeliveryPointsRepository;
let createDeliveryPoint: CreateDeliveryPointService;
let deleteDeliveryPoint: DeleteDeliveryPointService;

describe('DeleteDeliveryPoint', () => {
  beforeEach(() => {
    fakeDeliveryPointsRepository = new FakeDeliveryPointsRepository();

    createDeliveryPoint = new CreateDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
    deleteDeliveryPoint = new DeleteDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
  });

  it('should be able to delete a delivery point', async () => {
    const point = await createDeliveryPoint.execute({
      cep: '12345678',
      city: 'example',
      latitude: 40.6976701,
      longitude: -74.2598663,
      number: 1,
      state: 'example',
      street: 'example',
      suburb: 'center',
    });

    const message = await deleteDeliveryPoint.execute({
      point_id: point.id,
    });

    expect(message).toHaveProperty('message');
  });

  it('should not be able to delete the delivery point if the given id does not exist', async () => {
    await expect(
      deleteDeliveryPoint.execute({
        point_id: 'non-existing-point-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
