const { from, throwError } = require("rxjs");
const { catchError } = require("rxjs/operators");
const { verifyToken } = require("../../utils/jwt");

const {
  QUERY_NAMES: { AUTHENTICATE_USER },
} = require("../../config/queries");

const { AUTHENTICATION_ERROR } = require("../../config/errorTypes");

const authenticateUser = () => ({ params: { token } }) => {
  return from(verifyToken({ token })).pipe(
    catchError((err) =>
      throwError({
        errorType: AUTHENTICATION_ERROR,
        message: err.message,
      })
    )
  );
};

module.exports = () => ({
  [AUTHENTICATE_USER]: ({ params }) => authenticateUser({})({ params }),
});
