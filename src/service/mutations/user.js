const { from, throwError, of } = require("rxjs");
const { mergeMap, map, mapTo, tap, catchError } = require("rxjs/operators");
const { generateUuid } = require("../../utils/generateUuid");

const {
  hashPassword,
  comparePasswords,
} = require("../../utils/password-hashing");

const { createToken } = require("../../utils/jwt");

const {
  MUTATION_NAMES: {
    REGISTER_USER,
    CREATE_USER,
    USER_LOGIN,
    CHANGE_USER_PASSWORD,
    CONFIRM_EMAIL,
    SUBSCRIPTION,
    RESET_USER_PASSWORD,
    SEND_EMAIL,
    CONFIRM_RESET_USER_PASSWORD,
  },
} = require("../../config/mutations");

const {
  QUERY_NAMES: { GET_USER_BY_FIELD },
} = require("../../config/queries/queries");

const {
  USER_LOGIN_ERROR,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND_ERROR,
  USER_BAD_INPUT_ERROR,
  USER_PASSWORD_RESET_FAILED,
  RESET_PASSWORD_UUID_NOT_FOUND,
  RESET_PASSWORD_FAILED,
} = require("../../config/errorTypes");

const { confirmEmailMutation } = require("./user/confirmEmail");
const { changeUserPasswordMutation } = require("./user/subscription");

const CREATE_USER_EMAIL_TAKEN_ERR_MSG = (takenEmail) =>
  `User with email ${takenEmail} is taken.`;

const PASSWORD_RESTORATION_EMAIL_DEFAULT_SUBJECT =
  "Romanspiration password reset";

const userRegistrationProcess = ({ registerUser }) => ({
  params: { userToRegister },
  executeQuery,
  executeMutation,
}) =>
  from(
    executeQuery({
      queryName: GET_USER_BY_FIELD,
      params: {
        field: "email",
        value: userToRegister.email,
      },
    })
  ).pipe(
    mergeMap((userAlreadyExists) =>
      Boolean(userAlreadyExists)
        ? throwError({
            errorType: USER_ALREADY_EXISTS,
            message: CREATE_USER_EMAIL_TAKEN_ERR_MSG(userToRegister.email),
          })
        : from(hashPassword(userToRegister.password))
    ),
    map(({ hashedPsw }) => {
      const { password, ...userWithoutPassword } = userToRegister;
      const emailConfirmationUuid = generateUuid();

      return {
        hashedPsw,
        ...userWithoutPassword,
        emailConfirmationUuid,
        emailConfirmed: false,
        subscribe: false,
      };
    }),
    tap(({ email, emailConfirmationUuid }) =>
      executeMutation({
        mutationName: SEND_EMAIL,
        params: {
          recipient: email,
          subject: "Romanspiration email confirmation",
          templateName: "EMAIL_CONFIRMATION",
          params: { emailConfirmationUuid },
        },
      })
    ),
    mergeMap((user) =>
      from(registerUser({ user })).pipe(map(({ success }) => ({ success })))
    )
  );

const createUserProcess = ({ createUser }) => ({
  params: { userToCreate },
  executeQuery,
}) =>
  from(
    executeQuery({
      queryName: GET_USER_BY_FIELD,
      params: {
        field: "email",
        value: userToCreate.email,
      },
    })
  ).pipe(
    mergeMap((userAlreadyExists) =>
      Boolean(userAlreadyExists)
        ? throwError({
            errorType: USER_ALREADY_EXISTS,
            message: CREATE_USER_EMAIL_TAKEN_ERR_MSG(userToCreate.email),
          })
        : from(hashPassword(userToCreate.password))
    ),
    map(({ hashedPsw }) => {
      const { password, ...userWithoutPassword } = userToCreate;
      return { hashedPsw, ...userWithoutPassword, emailConfirmed: true };
    }),
    mergeMap((user) =>
      from(createUser({ user })).pipe(map(({ id }) => ({ id })))
    )
  );

const loginUser = () => ({ params, executeQuery }) =>
  from(
    executeQuery({
      queryName: GET_USER_BY_FIELD,
      params: {
        field: "email",
        value: params.email,
      },
    })
  ).pipe(
    map((foundUser) => {
      //TODO: Refactor
      if (!Boolean(foundUser)) {
        throw new Error(`User "${params.email}" not found.`);
      }

      if (!Boolean(foundUser.emailConfirmed)) {
        throw new Error(
          "The account is not confirmed, please confirm the account via email."
        );
      }

      const { password } = params;
      const { hashedPsw, ...userPayloadData } = foundUser;

      return {
        password,
        hashedPsw,
        userPayloadData,
      };
    }),
    mergeMap(({ password, hashedPsw, userPayloadData }) =>
      from(
        comparePasswords({
          pasw: password,
          hash: hashedPsw,
        })
      ).pipe(
        mergeMap((matchPassword) =>
          Boolean(matchPassword)
            ? from(createToken({ payload: userPayloadData })).pipe(
                map((token) => ({ token }))
              )
            : throwError({
                errorType: USER_LOGIN_ERROR,
                message: "Invalid credentials",
              })
        )
      )
    ),
    catchError((err) =>
      err.message.includes("User")
        ? throwError({ errorType: USER_NOT_FOUND_ERROR, message: err.message })
        : throwError({ errorType: USER_BAD_INPUT_ERROR, message: err.message })
    )
  );

const changeUserPassword = ({ updatePassword }) => ({ params, executeQuery }) =>
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

      const { password } = params.changeUserPasswordParams;
      const { hashedPsw } = foundUser;

      return {
        password,
        hashedPsw,
      };
    }),
    mergeMap(({ password, hashedPsw }) =>
      from(
        comparePasswords({
          pasw: password,
          hash: hashedPsw,
        })
      ).pipe(
        mergeMap((matchPassword) =>
          Boolean(matchPassword)
            ? from(
                hashPassword(params.changeUserPasswordParams.newPassword)
              ).pipe(
                mergeMap(({ hashedPsw }) =>
                  from(
                    updatePassword({ hashedPsw, userId: params.user._id })
                  ).pipe(
                    tap((res) => {
                      console.log("-> res ->");
                      console.log(res);
                      console.log("<<< res");
                    }),
                    catchError((errMsg) => {
                      // Change
                      return from({ success: false });
                    })
                  )
                )
              )
            : throwError({
                errorType: USER_LOGIN_ERROR,
                message: "Invalid credentials",
              })
        )
      )
    ),
    catchError((err) =>
      err.message.includes("User")
        ? throwError({ errorType: USER_NOT_FOUND_ERROR, message: err.message })
        : throwError({ errorType: USER_BAD_INPUT_ERROR, message: err.message })
    )
  );

const resetUserPassword = ({ setUserResetPasswordUUID }) => ({
  executeMutation,
  params: { restorationEmail = "" },
}) =>
  of(generateUuid()).pipe(
    mergeMap((userResetPasswordUUID) =>
      from(
        setUserResetPasswordUUID({
          email: restorationEmail,
          uuid: userResetPasswordUUID,
        })
      ).pipe(
        mergeMap((_) =>
          from(
            executeMutation({
              mutationName: SEND_EMAIL,
              params: {
                recipient: restorationEmail,
                subject: PASSWORD_RESTORATION_EMAIL_DEFAULT_SUBJECT,
                templateName: "PASSWORD_RESET",
                params: {
                  uuid: userResetPasswordUUID,
                },
              },
            })
          ).pipe(
            mapTo({ success: true }),
            catchError((err) => {
              throwError({
                errorType: USER_PASSWORD_RESET_FAILED,
                message: err.message,
              });
            })
          )
        )
      )
    )
  );

const confirmResetUserPassword = ({ updatePassword }) => ({
  params: { restorePasswordUUID, newPassword },
  executeQuery,
}) =>
  from(
    executeQuery({
      queryName: GET_USER_BY_FIELD,
      params: {
        field: "resetPasswordUUID",
        value: restorePasswordUUID,
      },
    })
  ).pipe(
    mergeMap((user) =>
      Boolean(user)
        ? from(hashPassword(newPassword)).pipe(
            mergeMap(({ hashedPsw }) => {
              return from(updatePassword({ userId: user._id, hashedPsw })).pipe(
                mapTo({ success: true }),
                catchError((err) =>
                  throwError({
                    errorType: RESET_PASSWORD_FAILED,
                    message: err.message,
                  })
                )
              );
            })
          )
        : throwError({
            errorType: RESET_PASSWORD_UUID_NOT_FOUND,
            message: `Invalid UUID`,
          })
    )
  );

module.exports = (integrationDependencies) => {
  const {
    createUser,
    registerUser,
    updatePassword,
    confirmEmail,
    updateSubscription,
    setUserResetPasswordUUID,
  } = integrationDependencies;

  return {
    [REGISTER_USER]: ({ params, executeQuery, executeMutation }) =>
      userRegistrationProcess({ registerUser })({
        params,
        executeQuery,
        executeMutation,
      }),
    [CREATE_USER]: ({ params, executeQuery }) =>
      createUserProcess({ createUser })({ params, executeQuery }),
    [USER_LOGIN]: ({ params, executeQuery }) =>
      loginUser()({ params, executeQuery }),
    [CHANGE_USER_PASSWORD]: ({ params, executeQuery }) =>
      changeUserPassword({ updatePassword })({ params, executeQuery }),
    [CONFIRM_EMAIL]: ({ params, executeQuery }) =>
      confirmEmailMutation({ confirmEmail })({ params, executeQuery }),
    [SUBSCRIPTION]: ({ params, executeQuery }) =>
      changeUserPasswordMutation({ updateSubscription })({
        params,
        executeQuery,
      }),
    [RESET_USER_PASSWORD]: ({ params, executeQuery, executeMutation }) =>
      resetUserPassword({ setUserResetPasswordUUID })({
        params,
        executeQuery,
        executeMutation,
      }),
    [CONFIRM_RESET_USER_PASSWORD]: ({
      params,
      executeQuery,
      executeMutation,
    }) =>
      confirmResetUserPassword({ updatePassword })({
        params,
        executeQuery,
      }),
  };
};

module.exports.integrationDependencies = ["user"];
