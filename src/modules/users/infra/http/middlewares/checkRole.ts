import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import { IRole } from '@modules/users/dtos/ICreateUserDTO';

const checkRole = (roles: IRole[]) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { id, role } = request.user;

    // Check that the matrix of authorized roles includes the user role or that the route is allowed for the user whose login is
    if (
      roles.indexOf(role as IRole) > -1 ||
      (roles.includes('himself') && id === request.params.user_id)
    ) {
      return next();
    }

    throw new AppError('Access denied', 401);
  };
};

export default checkRole;
