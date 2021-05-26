import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import ShowUserService from '@modules/users/services/ShowUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, phone, password, cpf, cnpj, role } = request.body;
    const token = request.headers.authorization;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      phone,
      password,
      cpf,
      cnpj,
      role,
      token,
    });

    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, sort_by, order, ...filter } = request.query;

    const parsedOrder =
      typeof order === 'string' && order.match(/asc/gi) ? 'ASC' : 'DESC';

    const listUsers = container.resolve(ListUsersService);

    const data = await listUsers.execute({
      page: Number(page),
      limit: Number(limit),
      sort_by: sort_by ? String(sort_by) : undefined,
      order: parsedOrder,
      ...filter,
    });

    return response.json(classToClass(data));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { role: roleRequest } = request.user;

    const {
      name,
      email,
      phone,
      password,
      old_password,
      cpf,
      cnpj,
      role,
    } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      user_id,
      name,
      email,
      phone,
      cpf,
      cnpj,
      old_password,
      password,
      role,
      roleRequest: roleRequest as IRole,
    });

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const deleteUser = container.resolve(DeleteUserService);

    const message = await deleteUser.execute({
      user_id,
    });

    return response.json(message);
  }
}
