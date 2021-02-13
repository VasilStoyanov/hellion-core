const { from, throwError } = require("rxjs");
const { mergeMap, map, catchError } = require("rxjs/operators");

const {
  QUERY_NAMES: { GET_USER_BY_FIELD },
} = require("../../../config/queries/queries");

const {
  USER_NOT_FOUND_ERROR,
  USER_BAD_INPUT_ERROR,
} = require("../../../config/errorTypes");

const confirmEmailMutation = ({ confirmEmail }) => ({ params, executeQuery }) =>
  from(
    executeQuery({
      queryName: GET_USER_BY_FIELD,
      params: {
        field: "emailConfirmationUuid",
        value: params.emailConfirmationUuid,
      },
    })
  ).pipe(
    map((foundUser) => {
      if (!Boolean(foundUser)) {
        throw new Error(`User not found.`);
      }

      if (Boolean(foundUser.emailConfirmed)) {
        throw new Error("Account is already confirmed");
      }

      return {
        email: foundUser.email,
      };
    }),
    mergeMap(({ email }) =>
      from(confirmEmail({ email })).pipe(map(({ success }) => ({ success })))
    ),
    catchError((err) =>
      err.message.includes("User")
        ? throwError({ errorType: USER_NOT_FOUND_ERROR, message: err.message })
        : throwError({ errorType: USER_BAD_INPUT_ERROR, message: err.message })
    )
  );

module.exports.confirmEmailMutation = confirmEmailMutation;
