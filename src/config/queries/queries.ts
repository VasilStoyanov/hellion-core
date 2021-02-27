import RequestOptions from './query-request-middleware';
import UserRoles from '../user-roles';

export interface QueryConfigType {
  [K: string]: string | Record<string, string[]>;
}

export const queryOptions: QueryConfigType = {
  // AUTH
  AUTHENTICATE_USER: 'AUTHENTICATE_USER',
  AUTHORIZE_USER: 'AUTHORIZE_USER',

  // USER
  GET_CATEGORIES: 'GET_CATEGORIES',
  GET_USERS: 'GET_USERS',
  GET_USER_BY_FIELD: 'GET_USER_BY_FIELD',
  GET_USER_ROLES: {
    [RequestOptions.AUTHORIZE_FOR_ROLES]: [UserRoles.ADMIN, UserRoles.MODERATOR],
  },
  GET_SUBSCRIBED_USERS: {},
};

export const QUERY_NAMES = Object.keys(queryOptions).reduce(
  (acc: Record<string, string>, key: string) => ({
    ...acc,
    [key]: key,
  }),
  {},
);
