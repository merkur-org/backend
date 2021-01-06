import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

const checkRole = (roles: Array<string>) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { id } = request.user;

    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(id);

    // Check that the matrix of authorized roles includes the user role or that the route is allowed for the user whose login is
    if (
      roles.indexOf(user.role) > -1 ||
      (roles.includes('himself') && user.id === request.params.user_id)
    ) {
      return next();
    }

    throw new AppError('Access denied', 401);
  };
};

export default checkRole;
