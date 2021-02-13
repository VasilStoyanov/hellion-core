const { from } = require("rxjs");

const {
  QUERY_NAMES: { AUTHENTICATE_USER },
} = require("../../config/queries");

module.exports = new Promise(async (resolve) => {
  const { executeQuery } = await require("../../service");

  const authenticateUser = ({ token }) =>
    from(
      executeQuery({
        queryName: AUTHENTICATE_USER,
        params: { token },
      })
    );

  resolve(authenticateUser);
});
