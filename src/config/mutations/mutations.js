const {
  AUTHORIZE_FOR_ROLES,
  REQUIRE_AUTHENTICATION,
} = require("./mutation-request-middleware");
const { ADMIN, MODERATOR } = require("../user-roles");

const mutationOptions = {
  // USER
  CREATE_USER: {},
  USER_LOGIN: {},
  REGISTER_USER: {},
  CHANGE_USER_PASSWORD: {
    [REQUIRE_AUTHENTICATION]: true,
  },
  CONFIRM_EMAIL: {},
  SUBSCRIPTION: {
    [REQUIRE_AUTHENTICATION]: true,
  },
  RESET_USER_PASSWORD: {},
  CONFIRM_RESET_USER_PASSWORD: {}
};

module.exports = {
  MUTATION_NAMES: Object.keys(mutationOptions).reduce((acc, key) => {
    return {
      ...acc,
      [key]: key,
    };
  }, {}),
  mutationOptions,
};
