import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import Config from '@config/index';
import AppError from '@shared/errors/AppError';
import { IRole } from '@modules/users/dtos/ICreateUserDTO';

interface ITokenPayload {
  iat: number;
  exp: number;
  id: string;
  role: IRole;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, Config.jwt.secret);

    const sub = decoded as ITokenPayload;

    request.user = {
      id: sub.id,
      role: sub.role,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
