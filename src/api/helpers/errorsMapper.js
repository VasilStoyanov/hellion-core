const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} = require("apollo-server-express");

const CONFLICT_CODE = "CONFLICT";
const NOT_FOUND_CODE = "NOT_FOUND";

const {
  AUTHENTICATION_ERROR,
  AUTHORIZATION_ERROR,
  USER_LOGIN_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_BAD_INPUT_ERROR,
  ARTICLE_ALREADY_EXISTS_ERROR,
  ARTICLE_CREATION_FAILED,
  ARTICLE_DOES_NOT_EXIST_ERROR,
  ARTICLE_REPLACE_FAILED,
  ARTICLE_DELETE_FAILED,
  INVALID_ID_ERROR,
  NOT_IMPLEMENTED_ERROR,
} = require("../../config/errorTypes");

const genericErrorConfig = {
  // Auth
  [AUTHENTICATION_ERROR]: ({ message }) => new AuthenticationError(message),
  [AUTHORIZATION_ERROR]: ({ message }) => new ForbiddenError(message),

  // User
  [USER_LOGIN_ERROR]: ({ message }) => new UserInputError(message),
  [USER_BAD_INPUT_ERROR]: ({ message }) => new UserInputError(message),
  [USER_ALREADY_EXISTS_ERROR]: ({ message }) =>
    new ApolloError(message, CONFLICT_CODE),
  [USER_NOT_FOUND_ERROR]: ({ message }) =>
    new ApolloError(message, NOT_FOUND_CODE),

  // article
  [ARTICLE_ALREADY_EXISTS_ERROR]: ({ message }) =>
    new ApolloError(message, CONFLICT_CODE),
  [ARTICLE_CREATION_FAILED]: ({ message }) => new ApolloError(message),
  [ARTICLE_DOES_NOT_EXIST_ERROR]: ({ message }) =>
    new ApolloError(message, NOT_FOUND_CODE),
  [ARTICLE_REPLACE_FAILED]: ({ message }) => new ApolloError(message),
  [ARTICLE_DELETE_FAILED]: ({ message }) => new ApolloError(message),

  // Mongo
  [INVALID_ID_ERROR]: ({ message }) => new UserInputError(message),

  // Not implemented
  [NOT_IMPLEMENTED_ERROR]: ({ message }) => new ApolloError(message),
};

module.exports = ({ error = {} }) => {
  const { errorType = "", message = "" } = error;
  const errorHandler = genericErrorConfig[errorType];

  if (!errorHandler) {
    return new ApolloError(message || error);
  }

  return errorHandler({ message });
};
