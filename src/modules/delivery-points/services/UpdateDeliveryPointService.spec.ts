import AppError from '@shared/errors/AppError';

import FakeDeliveryPointsRepository from '../repositories/fakes/FakeDeliveryPointsRepository';
import UpdateDeliveryPointService from './UpdateDeliveryPointService';
import CreateDeliveryPointService from './CreateDeliveryPointService';

let fakeDeliveryPointsRepository: FakeDeliveryPointsRepository;
let createDeliveryPoint: CreateDeliveryPointService;
let updateDeliveryPoint: UpdateDeliveryPointService;

describe('UpdateDeliveryPoint', () => {
  beforeEach(() => {
    fakeDeliveryPointsRepository = new FakeDeliveryPointsRepository();

    createDeliveryPoint = new CreateDeliveryPointService(
      fakeDeliveryPointsRepository,
    );

    updateDeliveryPoint = new UpdateDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
  });

  it('should be able update the user', async () => {
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

    const updatedPoint = await updateDeliveryPoint.execute({
      point_id: point.id,
      cep: '87654321',
      city: 'example2',
      latitude: 40.6976701,
      longitude: -74.2598663,
      number: 1,
      state: 'example',
      street: 'example',
      suburb: 'center',
      role: 'r',
    });

    expect(updatedPoint.cep).toBe('87654321');
    expect(updatedPoint.city).toBe('example2');
  });

  it('should not be able update the delivery point from non-existing point', async () => {
    await expect(
      updateDeliveryPoint.execute({
        point_id: 'non-existing-user-id',
        cep: '12345678',
        city: 'example',
        latitude: 40.6976701,
        longitude: -74.2598663,
        number: 1,
        state: 'example',
        street: 'example',
        suburb: 'center',
        role: 'r',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the delivery point if the user who is operating is not root', async () => {
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

    await expect(
      updateDeliveryPoint.execute({
        point_id: point.id,
        cep: point.cep,
        city: point.city,
        latitude: point.latitude,
        longitude: point.longitude,
        number: point.number,
        state: point.state,
        street: point.street,
        suburb: point.suburb,
        role: 'b',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
