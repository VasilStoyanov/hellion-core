import queryRequestMiddleware from './query-request-middleware';
import UserRoles from '../user-roles';

console.log(queryRequestMiddleware);
console.log(UserRoles)

export interface QueryConfigType {
  [K: string]: string | object
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
    [queryRequestMiddleware.AUTHORIZE_FOR_ROLES]: [UserRoles.ADMIN, UserRoles.MODERATOR],
  },
  GET_SUBSCRIBED_USERS: {}
};

const neshtosi = Object.keys(queryConfig).reduce((acc: object, key: string) => ({
  ...acc,
  [key]: key,
}),
  {})

const queryConfigModule: Record<string, object> = {
  QUERY_NAMES: neshtosi,
  queryOptions: queryConfig,
};

export default queryConfigModule