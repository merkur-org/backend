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

  it('should not be able update the user from non-existing user', async () => {
    await expect(
      updateDeliveryPoint.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com',
        roleRequest: 'r',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await createDeliveryPoint.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    const user = await createDeliveryPoint.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Test',
        email: 'johndoe@example.com',
        roleRequest: 'r',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await createDeliveryPoint.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    const updatedUser = await updateDeliveryPoint.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      old_password: '123456',
      password: '123123',
      roleRequest: 'r',
      idRequest: 'id',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '123123',
        roleRequest: 'r',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
        roleRequest: 'r',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the cpf if it is already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '1234567890',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'John Trê',
        cpf: '123456789',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
        roleRequest: 'r',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the cnpj if it is already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
      cnpj: '123456789',
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '1234567890',
      cnpj: '1234567890',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'John Trê',
        cpf: '1234567890',
        cnpj: '123456789',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
        roleRequest: 'r',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update if the user id is not the same as the request and the permission of the user who is operating is not root', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '1234567890',
      cnpj: '1234567890',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: user.name,
        cpf: user.cpf,
        cnpj: user.cnpj,
        email: user.email,
        roleRequest: 'b',
        idRequest: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should must be able to update the permission if the user who is operating is root', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '1234567890',
      cnpj: '1234567890',
    });

    const userUpdated = await updateUser.execute({
      user_id: user.id,
      name: user.name,
      cpf: user.cpf,
      cnpj: user.cnpj,
      email: user.email,
      roleRequest: 'r',
      role: 'bp',
      idRequest: user.id,
    });

    expect(userUpdated.role).toBe('bp');
  });

  it('should not be able to update the permission if the user who is operating is not root', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '1234567890',
      cnpj: '1234567890',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: user.name,
        cpf: user.cpf,
        cnpj: user.cnpj,
        email: user.email,
        roleRequest: 'b',
        role: 'bp',
        idRequest: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
