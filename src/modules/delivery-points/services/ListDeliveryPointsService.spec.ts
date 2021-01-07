import FakeDeliveryPointsRepository from '../repositories/fakes/FakeDeliveryPointsRepository';
import ListDeliveryPointsService from './ListDeliveryPointsService';
import CreateDeliveryPointService from './CreateDeliveryPointService';

let fakeDeliveryPointsRepository: FakeDeliveryPointsRepository;
let listDeliveryPoints: ListDeliveryPointsService;
let createDeliveryPoint: CreateDeliveryPointService;

describe('listUsers', () => {
  beforeEach(() => {
    fakeDeliveryPointsRepository = new FakeDeliveryPointsRepository();

    createDeliveryPoint = new CreateDeliveryPointService(
      fakeDeliveryPointsRepository,
    );
    listDeliveryPoints = new ListDeliveryPointsService(
      fakeDeliveryPointsRepository,
    );
  });

  it('should be able show the Delivery Point', async () => {
    await createDeliveryPoint.execute({
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

    const points = await listDeliveryPoints.execute({
      point_state: 'example',
      limit: 10,
      page: 1,
    });

    expect(points.data.length).toBe(1);
    expect(points.limit).toBe(10);
    expect(points.page).toBe(1);
    expect(points.totalCount).toBe(1);
  });

  it('should be able show the delivery points', async () => {
    await createDeliveryPoint.execute({
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
    await createDeliveryPoint.execute({
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
    await createDeliveryPoint.execute({
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

    const users = await listDeliveryPoints.execute({
      point_state: 'example',
      limit: 1,
      page: 1,
    });

    expect(users.data.length).toBe(1);
    expect(users.limit).toBe(1);
    expect(users.page).toBe(1);
    expect(users.totalCount).toBe(3);
  });
});
