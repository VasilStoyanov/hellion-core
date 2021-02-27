import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import ErrorTypes from '../../config/errorTypes';

const CONFLICT_CODE = "CONFLICT";
const NOT_FOUND_CODE = "NOT_FOUND";

interface ErrorMapperParams {
  message: string
}

type GenericErrorConfigResult = AuthenticationError | ForbiddenError | UserInputError | ApolloError;

const genericErrorConfig: Record<string, ({ message }: ErrorMapperParams) => GenericErrorConfigResult> = {
  // Auth
  [ErrorTypes.AUTHENTICATION_ERROR]: ({ message }) => new AuthenticationError(message),
  [ErrorTypes.AUTHORIZATION_ERROR]: ({ message }) => new ForbiddenError(message),

  // User
  [ErrorTypes.USER_LOGIN_ERROR]: ({ message }) => new UserInputError(message),
  [ErrorTypes.USER_BAD_INPUT_ERROR]: ({ message }) => new UserInputError(message),
  [ErrorTypes.USER_ALREADY_EXISTS_ERROR]: ({ message }) => new ApolloError(message, CONFLICT_CODE),
  [ErrorTypes.USER_NOT_FOUND_ERROR]: ({ message }) => new ApolloError(message, NOT_FOUND_CODE),

  // Mongo
  [ErrorTypes.INVALID_ID_ERROR]: ({ message }) => new UserInputError(message),

  // Not implemented
  [ErrorTypes.NOT_IMPLEMENTED_ERROR]: ({ message }) => new ApolloError(message),
};

export default <T extends { errorType: string, message: string }>({ errorType = "", message = "" }: T): GenericErrorConfigResult => {
  const errorHandler = genericErrorConfig[errorType];

  if (!errorHandler) {
    return new ApolloError(message || errorType);
  }

  return errorHandler({ message });
};
