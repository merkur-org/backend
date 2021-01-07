import AppError from '@shared/errors/AppError';
import logger from '@shared/utils/logger';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<{ message: string }> {
    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('User not found', 404);
    }
    await this.usersRepository.delete(user_id);

    logger.info(`user deleted `);

    return { message: 'user deleted' };
  }
}

export default DeleteUserService;
