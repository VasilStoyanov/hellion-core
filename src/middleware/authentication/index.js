const { of } = require("rxjs");
const { mergeMap, map, pluck, defaultIfEmpty } = require("rxjs/operators");
const {
  REQUIRE_AUTHENTICATION,
} = require("../../config/common-request-middleware");

module.exports = new Promise(async (resolve) => {
  const authenticateUser = await require("./authenticate");

  const authentication = ({ token = "", requestOptions = {} }) =>
    of(requestOptions).pipe(
      pluck(REQUIRE_AUTHENTICATION),
      map(Boolean),
      mergeMap((requireAuthentication) =>
        requireAuthentication ? authenticateUser({ token }) : of()
      ),
      defaultIfEmpty(null)
    );

  resolve(authentication);
});
