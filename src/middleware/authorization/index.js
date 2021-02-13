const { of, from } = require("rxjs");
const { mergeMap, mapTo, pluck, defaultIfEmpty } = require("rxjs/operators");
const {
  AUTHORIZE_FOR_ROLES,
} = require("../../config/common-request-middleware");

module.exports = new Promise(async (resolve) => {
  const authenticateUser = await require("../authentication/authenticate");
  const authorizeUser = await require("./authorize");

  const authorization = ({ token = "", requestOptions = {} }) =>
    of(requestOptions).pipe(
      pluck(AUTHORIZE_FOR_ROLES),
      mergeMap((requiredRoles) =>
        Boolean(Array.isArray(requiredRoles) && requiredRoles.length)
          ? authenticateUser({ token }).pipe(
              mergeMap((user) =>
                from(
                  authorizeUser({
                    requiredRoles,
                    userRoles: user.roles || [],
                  })
                ).pipe(mapTo(user))
              )
            )
          : of()
      ),
      defaultIfEmpty(null)
    );

  resolve(authorization);
});
