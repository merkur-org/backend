/* eslint-disable @typescript-eslint/no-explicit-any */
import { verify } from 'jsonwebtoken';
import Config from '@config/index';
import AppError from '@shared/errors/AppError';
import { IRole } from '@modules/users/dtos/ICreateUserDTO';

interface ISub {
  id: string;
  role: IRole;
}

export const checkRootUser = (authHeader: string): boolean => {
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, Config.jwt.secret);

    const sub = decoded as ISub;

    if (sub.role === 'r') {
      return true;
    }
    return false;
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
};
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[() -]/gi, '');
};

export const create_slug = (value: string | string[]): string => {
  if (!value) return '';
  const valueNormalized = Array.isArray(value) ? value[0] : value;
  return valueNormalized
    .trim()
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòõöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/'/g, '')
    .replace(new RegExp('/', 'g'), '-')
    .replace(new RegExp(' ', 'g'), '-');
};

export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

export function mountQueryWhere(filters: any, entity: string): string {
  let queryWhere = ``;

  Object.keys(filters).forEach(key => {
    if (key && hasKey(filters, key) && filters[key] !== undefined) {
      queryWhere =
        queryWhere.length > 10 ? (queryWhere += ` AND `) : queryWhere;

      queryWhere += `${entity}.${key} = '${filters[key]}'`;
    }
  });

  return queryWhere;
}

export function mountQueryWhereWithName(filters: any, entity: string): string {
  let queryWhere = ``;
  Object.keys(filters).forEach(key => {
    if (key && hasKey(filters, key) && key !== 'name') {
      queryWhere =
        queryWhere.length > 10 ? (queryWhere += ` AND `) : queryWhere;

      queryWhere += `${entity}.${key} = '${filters[key]}'`;
    }

    if (key === 'name') {
      queryWhere =
        queryWhere.length > 10 ? (queryWhere += ` AND `) : queryWhere;

      queryWhere += `to_tsvector('portuguese', unaccent(${entity}.${key})) @@
      plainto_tsquery('portuguese', unaccent('${filters[key]}'))`;
    }
  });

  return queryWhere;
}
