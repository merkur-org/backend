import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '111111111',
      phone: '46 99999-9999',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '111111111',
      phone: '46 99999-9999',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate ', async () => {
    await expect(authenticateUser.execute({})).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate ', async () => {
    await expect(
      authenticateUser.execute({ email: 'teste@email' }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      authenticateUser.execute({ password: 'teste-password' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate ', async () => {
    await expect(
      authenticateUser.execute({ cpf: '111111' }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      authenticateUser.execute({ phone: '46 99999-9999' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate ', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '111111',
      phone: '46 99999-9999',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({ cpf: 'error-cpf', phone: '46 99999-9999' }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authenticateUser.execute({ cpf: '111111', phone: '(46) 99999-9999' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
