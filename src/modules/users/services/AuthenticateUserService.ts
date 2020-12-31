/* eslint-disable prettier/prettier */
import { sign } from 'jsonwebtoken';
import Config from '@config/index';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { normalizePhone } from '@shared/utils/helpers';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email?: string;
  password?: string;
  cpf?: string;
  phone?: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    email,
    password,
    cpf,
    phone,
  }: IRequest): Promise<IResponse> {
    if (!email && !password && !cpf && !phone) {
      throw new AppError(
        'Incorrect data send email/password or phone/cpf',
        401,
      );
    }

    if ((email && !password) || (password && !email)) {
      throw new AppError('Incorrect send email and password', 401);
    }

    if ((cpf && !phone) || (phone && !cpf)) {
      throw new AppError('Incorrect send cpf and phone', 401);
    }

    const user = await this.usersRepository.checkUserExists(String(email), cpf);

    if (!user) {
      throw new AppError('Incorrect combination.', 401);
    }

    if (email && password) {
      const passwordMatched = await this.hashProvider.compareHash(
        password,
        user.password,
      );

      if (!passwordMatched) {
        throw new AppError('Incorrect email/password combination.', 401);
      }
    }

    if (
      phone &&
      cpf &&
      (user.cpf !== cpf || user.phone !== normalizePhone(phone))
    ) {
      throw new AppError('Incorrect phone/cpf combination.', 401);
    }

    const { secret, expiresIn } = Config.jwt;
    const { role, id } = user;

    const token = sign({ role, id }, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
