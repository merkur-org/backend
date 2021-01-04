import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';
import { IRole } from '../dtos/ICreateUserDTO';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  role?: IRole;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  old_password?: string;
  password?: string;
  roleRequest: IRole;
  idRequest: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    phone,
    email,
    role,
    cpf = 'uninformed',
    cnpj = 'uninformed',
    old_password,
    password,
    roleRequest,
    idRequest,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user && user.id !== idRequest && roleRequest !== 'r') {
      throw new AppError('operation not allowed', 401);
    }

    const [
      userWithUpdatedEmail,
      userWithUpdatedCPF,
      userWithUpdatedCNPJ,
    ] = await Promise.all([
      this.usersRepository.findByEmail(email),
      this.usersRepository.findByCPF(cpf),
      this.usersRepository.findByCNPJ(cnpj),
    ]);

    if (userWithUpdatedCPF && userWithUpdatedCPF.id !== user_id) {
      throw new AppError('CPF already in use.');
    }

    if (userWithUpdatedCNPJ && userWithUpdatedCNPJ.id !== user_id) {
      throw new AppError('CNPJ already in use.');
    }

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    user.name = name;
    user.email = email;
    user.cpf = cpf.match(/uninformed/gi) ? user.cpf : cpf;
    user.cnpj = cnpj.match(/uninformed/gi) ? user.cnpj : cnpj;
    user.phone = phone || user.phone;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    if (role) {
      if (roleRequest !== 'r') {
        throw new AppError(
          'Permission denied, only root user can create root',
          401,
        );
      }
      user.role = role;
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateUserService;
