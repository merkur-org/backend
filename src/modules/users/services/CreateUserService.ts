import Config from '@config/index';
import AppError from '@shared/errors/AppError';
import { checkRootUser, normalizePhone } from '@shared/utils/helpers';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { IRole } from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

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

interface IResponse {
  user: User;
  token: string;
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
  }: IRequest): Promise<IResponse> {
    if (
      !['b', 'p', 'bp'].includes(role) &&
      (!token || (token && !checkRootUser(token)))
    ) {
      throw new AppError(
        'Permission denied, only root user can create root',
        401,
      );
    }

    const checkUserExists = await this.usersRepository.checkUserExists(
      email,
      cpf,
      cnpj,
    );

    if (checkUserExists) {
      throw new AppError('User already exists');
    }

    let hashedPassword = password;
    if (password) {
      hashedPassword = await this.hashProvider.generateHash(password);
    }

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

    const { secret, expiresIn } = Config.jwt;

    const userToken = sign({ role, id: user.id }, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token: userToken };
  }
}

export default CreateUserService;
