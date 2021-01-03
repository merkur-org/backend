import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import ShowUserService from '@modules/users/services/ShowUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

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

    return response.json(user);
  }

  // TODO fazer um metodo list para listar com paginação e filtros...

  public async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ user_id });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { role: roleRequest, id: idRequest } = request.user;

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
      idRequest,
    });

    return response.json(user);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const deleteUser = container.resolve(DeleteUserService);

    const user = await deleteUser.execute({ user_id });

    return response.json(user);
  }
}
