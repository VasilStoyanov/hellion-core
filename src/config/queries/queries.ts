import RequestOptions from './query-request-middleware';
import UserRoles from '../user-roles';

export interface QueryConfigType {
  [K: string]: string | Record<string, number[]>
}

const queryConfig: QueryConfigType = {
  // AUTH
  AUTHENTICATE_USER: "AUTHENTICATE_USER",
  AUTHORIZE_USER: "AUTHORIZE_USER",

  // USER
  GET_CATEGORIES: "GET_CATEGORIES",
  GET_USERS: "GET_USERS",
  GET_USER_BY_FIELD: "GET_USER_BY_FIELD",
  GET_USER_ROLES: {
    [AUTHORIZE_FOR_ROLES]: [UserRoles.ADMIN, UserRoles.MODERATOR],
  },
  GET_SUBSCRIBED_USERS: {}
};

const QUERY_NAMES = Object.keys(queryConfig).reduce((acc: Record<string, string>, key: string) => ({
  ...acc,
  [key]: key,
}),
  {})

const queryConfigModule: Record<string, Record<string, string> | QueryConfigType> = {
  QUERY_NAMES,
  queryOptions: queryConfig,
};

export default queryConfigModule