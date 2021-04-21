import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IListsReposiroty from '../repositories/IListsReposiroty';

interface IRequest {
  list_id: string;
}

@injectable()
class DeleteListService {
  constructor(
    @inject('ListsReposiroty')
    private listsRepository: IListsReposiroty,
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
