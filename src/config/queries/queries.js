const { AUTHORIZE_FOR_ROLES } = require("./query-request-middleware");
const { ADMIN, MODERATOR } = require("../user-roles");

const queryConfig = {
  // AUTH
  AUTHENTICATE_USER: "AUTHENTICATE_USER",
  AUTHORIZE_USER: "AUTHORIZE_USER",

  // USER
  GET_CATEGORIES: "GET_CATEGORIES",
  GET_USERS: "GET_USERS",
  GET_USER_BY_FIELD: "GET_USER_BY_FIELD",
  GET_USER_ROLES: {
    [AUTHORIZE_FOR_ROLES]: [ADMIN, MODERATOR],
  },
  GET_SUBSCRIBED_USERS: {}
};

module.exports = Object.freeze({
  QUERY_NAMES: Object.keys(queryConfig).reduce((acc, key) => {
    return {
      ...acc,
      [key]: key,
    };
  }, {}),
  queryOptions: queryConfig,
});
