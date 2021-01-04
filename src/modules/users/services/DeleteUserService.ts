import AppError from '@shared/errors/AppError';
import logger from '@shared/utils/logger';
import { injectable, inject } from 'tsyringe';
import { IRole } from '../dtos/ICreateUserDTO';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  role: IRole;
  request_user_id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    role,
    request_user_id,
  }: IRequest): Promise<{ message: string }> {
    if (role !== 'r' && role !== 'a' && user_id !== request_user_id) {
      throw new AppError(
        'Permission denied, only root or admin user can delet a users',
        401,
      );
    }

    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('User not found', 404);
    }
    await this.usersRepository.delete(user_id);

    logger.info(`user deleted by user: ${request_user_id}`);

    return { message: 'user deleted' };
  }
}

export default DeleteUserService;
