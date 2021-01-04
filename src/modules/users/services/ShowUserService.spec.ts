import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserService from './ShowUserService';

let fakeUsersRepository: FakeUsersRepository;
let showUser: ShowUserService;

describe('ShowUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUser = new ShowUserService(fakeUsersRepository);
  });

  it('should be able show the User', async () => {
    const created_user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      cpf: '111111111',
      phone: '46 99999-9999',
      password: '123456',
    });

    const user = await showUser.execute({
      user_id: created_user.id,
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
  });

  it('should not be able show the User from non-existing user', async () => {
    await expect(
      showUser.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
