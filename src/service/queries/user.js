const { from, pairs } = require("rxjs");
const { reduce, map, mapTo, tap, catchError } = require("rxjs/operators");

const {
  QUERY_NAMES: {
    GET_USERS,
    GET_USER_BY_FIELD,
    GET_USER_ROLES,
    GET_SUBSCRIBED_USERS,
  },
  queryOptions,
} = require("../../config/queries");

const { GET_SUBSCRIBED_USERS_FAILED } = require("../../config/errorTypes");

const getAllUsers = ({ getUsers }) => ({ params }) => {
  return from(getUsers());
};

const getUserRoles = () => () =>
  pairs(require("../../config/user-roles")).pipe(
    map((arr) => Array.from(new Set(arr))),
    reduce((acc, curr) => acc.concat(curr))
  );

const getOneUserByField = ({ getUserByField }) => ({ params }) => {
  const { field, value } = params;
  return from(getUserByField({ field, value }));
};

const fetchSubscribedUsers = ({ getSubscribedUsers }) => ({ params }) =>
  from(getSubscribedUsers()).pipe(
    map((subscribedUsers) => subscribedUsers),
    catchError((err) =>
      throwError({ errorType: GET_SUBSCRIBED_USERS_FAILED, message: err.msg })
    )
  );

module.exports = (integrationDependencies) => {
  const {
    getUsers,
    getUserByField,
    getSubscribedUsers,
  } = integrationDependencies;

  return {
    [GET_USERS]: ({ params }) => getAllUsers({ getUsers })({ params }),
    [GET_USER_ROLES]: ({ params }) => getUserRoles()({ params }),
    [GET_USER_BY_FIELD]: ({ params }) =>
      getOneUserByField({ getUserByField })({ params }),
    [GET_SUBSCRIBED_USERS]: ({ params }) =>
      fetchSubscribedUsers({ getSubscribedUsers })({ params }),
  };
};

module.exports.integrationDependencies = ["user"];
