import MutationRequestOptions from './mutation-request-middleware';
import UserRoles from '../user-roles';

const mutationOptions = {
  // USER
  CREATE_USER: {},
  USER_LOGIN: {},
  REGISTER_USER: {},
  CHANGE_USER_PASSWORD: {
    [MutationRequestOptions.REQUIRE_AUTHENTICATION]: true,
  },
  CONFIRM_EMAIL: {},
  SUBSCRIPTION: {
    [MutationRequestOptions.REQUIRE_AUTHENTICATION]: true,
  },
  RESET_USER_PASSWORD: {},
  CONFIRM_RESET_USER_PASSWORD: {},
};

export const MUTATION_NAMES: Readonly<Record<string, string>> = Object.freeze(
  Object.keys(mutationOptions).reduce((acc, key) => {
    return {
      ...acc,
      [key]: key,
    };
  }, {}),
);

export { mutationOptions };
