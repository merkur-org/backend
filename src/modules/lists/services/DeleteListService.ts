import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IListsRepository from '../repositories/IListsRepository';

interface IRequest {
  list_id: string;
}

@injectable()
class DeleteListService {
  constructor(
    @inject('ListsRepository')
    private listsRepository: IListsRepository,
  ) {}

  public async execute({ list_id }: IRequest): Promise<{ message: string }> {
    const list = await this.listsRepository.findById(list_id);

    if (!list) {
      throw new AppError('List not found', 404);
    }

    await this.listsRepository.delete(list.id);

    return { message: 'List deleted' };
  }
}

export default DeleteListService;
