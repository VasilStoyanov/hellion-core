const { from, throwError } = require("rxjs");
const { mergeMap, map, catchError, tap } = require("rxjs/operators");

const {
  QUERY_NAMES: { GET_USER_BY_FIELD },
} = require("../../../config/queries/queries");

const changeUserPasswordMutation = ({ updateSubscription }) => ({
  params,
  executeQuery,
}) =>
  from(
    executeQuery({
      queryName: GET_USER_BY_FIELD,
      params: {
        field: "email",
        value: params.user.email,
      },
    })
  ).pipe(
    map((foundUser) => {
      if (!Boolean(foundUser)) {
        throw new Error(`User "${params.email}" not found.`);
      }

      return {
        userId: params.user._id,
        subscribe: params.subscribe,
      };
    }),
    mergeMap(({ userId, subscribe }) =>
      from(updateSubscription({ userId, subscribe })).pipe(
        map(({ success }) => ({ success })),
        catchError(() => ({
          success: false,
        }))
      )
    )
  );

module.exports.changeUserPasswordMutation = changeUserPasswordMutation;
