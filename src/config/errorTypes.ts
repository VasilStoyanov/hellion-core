enum ErrorTypes {
  /* Auth */
  AUTHENTICATION_ERROR,
  AUTHORIZATION_ERROR,

  /* User */
  USER_LOGIN_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_BAD_INPUT_ERROR,
  USER_PASSWORD_RESET_FAILED,
  GET_SUBSCRIBED_USERS_FAILED,
  RESET_PASSWORD_UUID_NOT_FOUND,
  RESET_PASSWORD_FAILED,

  // MONGO
  INVALID_ID_ERROR,

  // NOT IMPLEMENTED
  NOT_IMPLEMENTED_ERROR,

  // EMAIL
  SEND_EMAIL_FAILED,
}

export default ErrorTypes