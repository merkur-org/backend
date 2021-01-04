import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email another', async () => {
    await createUser.execute({
      name: 'John Doe',
      phone: '46 99999999',
      email: 'johndoe@example.com',
      password: '123456',
      cpf: '123456789',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '46 99999999',
        password: '123456',
        cpf: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new root user or administrator if you are not root', async () => {
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '46 99999999',
        password: '123456',
        cpf: '123456789',
        role: 'r',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with root permission if it is not a user root that is creating', async () => {
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '46 99999999',
        password: '123456',
        cpf: '123456789',
        role: 'r',
        token: 'non-root-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
