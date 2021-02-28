import { ErrorParamsType } from "../../types/error-types/error-types";
import { ConfirmEmailType, CreateUserType, RegisterUserType, ResetPassConfirmationType, UserChangePassType, UserEmailRestorationType, UserLoginType, UserSubscriptionType } from "./resolver-types/user-types";

export type HandleMutationsParamsType<T> = {
  readonly [K in keyof T ]: T[K]
}

export default {
  /* <<< Query RESOLVERS >>> */

  queryResolvers: ({ handleQuery, handleError, QUERY_NAMES: { GET_USER_ROLES } }) => ({
    userRoles: <T>(_parent: T, queryArguments, { token }) =>
      handleQuery({
        queryName: GET_USER_ROLES,
        params: { token },
      }).catch((error) => handleError({ error })),
  }),

  /* ( -> Mutation RESOLVERS <- ) */

  mutationResolvers: ({
    handleMutation,
    handleError,
    MUTATION_NAMES: {
      CREATE_USER,
      USER_LOGIN,
      REGISTER_USER,
      CHANGE_USER_PASSWORD,
      CONFIRM_EMAIL,
      SUBSCRIPTION,
      RESET_USER_PASSWORD,
      CONFIRM_RESET_USER_PASSWORD,
    },
  }) => ({
    registerUser: <T>(_parent: T, { user: userToRegister }: RegisterUserType) =>
      handleMutation({
        mutationName: REGISTER_USER,
        params: { userToRegister },
      }).catch((error: ErrorParamsType) => handleError({ error })),

    createUser: <T>(_parent: T, { user: userToCreate }: CreateUserType,  { token }: {token: string}) =>
      handleMutation({
        mutationName: CREATE_USER,
        params: { token, userToCreate },
      }).catch((error: ErrorParamsType) => handleError({ error })),

    login: <T>(_parent: T, { credentials }: UserLoginType) =>
      handleMutation({
        mutationName: USER_LOGIN,
        params: credentials,
      }).catch((error: ErrorParamsType) => handleError({ error })),

    changePassword: <T>(_parent: T, { changeUserPasswordParams }: UserChangePassType, { token }: {token: string}) =>
      handleMutation({
        mutationName: CHANGE_USER_PASSWORD,
        params: { changeUserPasswordParams, token },
      }).catch((error: ErrorParamsType) => handleError({ error })),

    confirmEmail: <T>(_parent: T, { emailConfirmationUuid }: ConfirmEmailType) =>
      handleMutation({
        mutationName: CONFIRM_EMAIL,
        params: { emailConfirmationUuid },
      }).catch((error: ErrorParamsType) => handleError({ error })),

    subscription: <T>(_parent: T, { subscribe }: UserSubscriptionType, { token }: { token: string }) =>
      handleMutation({
        mutationName: SUBSCRIPTION,
        params: { subscribe, token },
      }).catch((error: ErrorParamsType) => handleError({ error })),

    resetPassword: <T>(_parent: T, { restorationEmail }: UserEmailRestorationType) =>
      handleMutation({
        mutationName: RESET_USER_PASSWORD,
        params: { restorationEmail },
      }).catch((error: ErrorParamsType) => handleError({ error })),

    confirmResetPassword: <T>(_parent: T, { restorePasswordUUID = '', newPassword = '' } : ResetPassConfirmationType) =>
      handleMutation({
        mutationName: CONFIRM_RESET_USER_PASSWORD,
        params: { restorePasswordUUID, newPassword },
      }).catch((error: ErrorParamsType) => handleError({ error })),
  }),
};
