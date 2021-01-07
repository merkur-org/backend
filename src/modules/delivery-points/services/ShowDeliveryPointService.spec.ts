import AppError from '@shared/errors/AppError';

import FakeDeliveryPointsRepository from '../repositories/fakes/FakeDeliveryPointsRepository';
import CreateDeliveryPointService from './CreateDeliveryPointService';
import ShowDeliveryPointService from './ShowDeliveryPointService';

let fakeDeliveryPointsRepository: FakeDeliveryPointsRepository;
let createDeliveryPoint: CreateDeliveryPointService;
let showDeliveryPoint: ShowDeliveryPointService;

describe('ShowDeliveryPoint', () => {
  beforeEach(() => {
    fakeDeliveryPointsRepository = new FakeDeliveryPointsRepository();

    createDeliveryPoint = new CreateDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
    showDeliveryPoint = new ShowDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
  });

  it('should be able show the delivery point', async () => {
    const created_point = await createDeliveryPoint.execute({
      cep: '12345678',
      city: 'example',
      latitude: 40.6976701,
      longitude: -74.2598663,
      number: 1,
      state: 'example',
      street: 'example',
      suburb: 'center',
      role: 'r',
    });

    const point = await showDeliveryPoint.execute({
      point_id: created_point.id,
    });

    expect(point.city).toBe('example');
    expect(point.cep).toBe('12345678');
  });

  it('should not be able show the delivery point from non-existing user', async () => {
    await expect(
      showDeliveryPoint.execute({
        point_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
