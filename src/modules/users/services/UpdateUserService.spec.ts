import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserService from './UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUser: UpdateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUser = new UpdateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able update the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
      cnpj: '123456789',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      cpf: '123456789',
      cnpj: '123456789',
      roleRequest: 'r',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able update the user from non-existing user', async () => {
    await expect(
      updateUser.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com',
        roleRequest: 'r',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
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
      cpf: '123456789',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Test',
        email: 'johndoe@example.com',
        roleRequest: 'r',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
      old_password: '123456',
      password: '123123',
      roleRequest: 'r',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
