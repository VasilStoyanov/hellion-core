export default {
  /* <<< Query RESOLVERS >>> */

  queryResolvers: ({ handleQuery, handleError, QUERY_NAMES: { GET_USER_ROLES } }) => ({
    userRoles: (rootQuery, queryArguments, { token }) =>
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
    registerUser: (rootQuery, { user: userToRegister }) =>
      handleMutation({
        mutationName: REGISTER_USER,
        params: { userToRegister },
      }).catch((error) => handleError({ error })),

    createUser: (rootQuery, { user: userToCreate }, { token }) =>
      handleMutation({
        mutationName: CREATE_USER,
        params: { token, userToCreate },
      }).catch((error) => handleError({ error })),

    login: (rootQuery, { credentials }) =>
      handleMutation({
        mutationName: USER_LOGIN,
        params: credentials,
      }).catch((error) => handleError({ error })),

    changePassword: (rootQuery, { changeUserPasswordParams }, { token }) =>
      handleMutation({
        mutationName: CHANGE_USER_PASSWORD,
        params: { changeUserPasswordParams, token },
      }).catch((error) => handleError({ error })),

    confirmEmail: (rootQuery, { emailConfirmationUuid }, { token }) =>
      handleMutation({
        mutationName: CONFIRM_EMAIL,
        params: { emailConfirmationUuid },
      }).catch((error) => handleError({ error })),

    subscription: (rootQuery, { subscribe }, { token }) =>
      handleMutation({
        mutationName: SUBSCRIPTION,
        params: { subscribe, token },
      }).catch((error) => handleError({ error })),

    resetPassword: (rootQuery, { restorationEmail }) =>
      handleMutation({
        mutationName: RESET_USER_PASSWORD,
        params: { restorationEmail },
      }).catch((error) => handleError({ error })),

    confirmResetPassword: (rootQuery, { restorePasswordUUID = '', newPassword = '' }) =>
      handleMutation({
        mutationName: CONFIRM_RESET_USER_PASSWORD,
        params: { restorePasswordUUID, newPassword },
      }).catch((error) => handleError({ error })),
  }),
};
