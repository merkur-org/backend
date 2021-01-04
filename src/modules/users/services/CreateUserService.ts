import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { checkRootUser, normalizePhone } from '@shared/utils/helpers';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';
import { IRole } from '../dtos/ICreateUserDTO';

interface IRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  cpf: string;
  cnpj?: string;
  role?: IRole;
  token?: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
    phone,
    cpf,
    cnpj,
    // caso não venha role, deixamos valor default como 'b'
    role = 'b',
    token,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.checkUserExists(
      email,
      cpf,
      cnpj,
    );

    if (checkUserExists) {
      throw new AppError('User already exists');
    }

    if (role === 'r' && (!token || (token && !checkRootUser(token)))) {
      throw new AppError(
        'Permission denied, only root user can create root',
        401,
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const phoneNormalized = normalizePhone(phone);

    const user = await this.usersRepository.create({
      name,
      email,
      phone: phoneNormalized,
      password: hashedPassword,
      cpf,
      cnpj,
      role,
    });

    return user;
  }
}

export default CreateUserService;
