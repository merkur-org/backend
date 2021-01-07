import AppError from '@shared/errors/AppError';

import FakeDeliveryPointsRepository from '../repositories/fakes/FakeDeliveryPointsRepository';
import CreateDeliveryPointService from './CreateDeliveryPointService';

let fakeDeliveryPointsRepository: FakeDeliveryPointsRepository;
let createDeliveryPoint: CreateDeliveryPointService;

describe('CreateDeliveryPoint', () => {
  beforeEach(() => {
    fakeDeliveryPointsRepository = new FakeDeliveryPointsRepository();

    createDeliveryPoint = new CreateDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
  });

  it('should be able to create a new delivery point', async () => {
    const point = await createDeliveryPoint.execute({
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

    expect(point).toHaveProperty('id');
  });

  it('should not be able to create a new delivery point if you are not root', async () => {
    await expect(
      createDeliveryPoint.execute({
        cep: '12345678',
        city: 'example',
        latitude: 40.6976701,
        longitude: -74.2598663,
        number: 1,
        state: 'example',
        street: 'example',
        suburb: 'center',
        role: 'b',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
