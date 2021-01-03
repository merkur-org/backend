import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;

describe('listUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able show the User', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999-9999',
      password: '123456',
    });

    const users = await listUsers.execute({});

    expect(users.data.length).toBe(1);
    expect(users.limit).toBe(10);
    expect(users.page).toBe(1);
    expect(users.totalCount).toBe(1);
  });

  it('should be able show the User', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999-9999',
      password: '123456',
    });
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndo1e@example.com',
      phone: '46 99999-9999',
      password: '123456',
    });
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndo2e@example.com',
      phone: '46 99999-9999',
      password: '123456',
    });

    const users = await listUsers.execute({ limit: 1 });

    expect(users.data.length).toBe(1);
    expect(users.limit).toBe(1);
    expect(users.page).toBe(1);
    expect(users.totalCount).toBe(3);
  });
});
