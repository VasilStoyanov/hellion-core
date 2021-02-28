import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import ErrorTypes from '../../config/errorTypes';

const CONFLICT_CODE = 'CONFLICT';
const NOT_FOUND_CODE = 'NOT_FOUND';

const genericErrorConfig: Record<string, ({ errorMessage }: ErrorMapperParams) => ErrorResponseType> = {
  // Auth
  [ErrorTypes.AUTHENTICATION_ERROR]: ({ errorMessage }) => new AuthenticationError(errorMessage),
  [ErrorTypes.AUTHORIZATION_ERROR]: ({ errorMessage }) => new ForbiddenError(errorMessage),

  // User
  [ErrorTypes.USER_LOGIN_ERROR]: ({ errorMessage }) => new UserInputError(errorMessage),
  [ErrorTypes.USER_BAD_INPUT_ERROR]: ({ errorMessage }) => new UserInputError(errorMessage),
  [ErrorTypes.USER_ALREADY_EXISTS_ERROR]: ({ errorMessage }) => new ApolloError(errorMessage, CONFLICT_CODE),
  [ErrorTypes.USER_NOT_FOUND_ERROR]: ({ errorMessage }) => new ApolloError(errorMessage, NOT_FOUND_CODE),

  // Mongo
  [ErrorTypes.INVALID_ID_ERROR]: ({ errorMessage }) => new UserInputError(errorMessage),

  // Not implemented
  [ErrorTypes.NOT_IMPLEMENTED_ERROR]: ({ errorMessage }) => new ApolloError(errorMessage),
};

export type ErrorParamsType = { errorType: string; errorMessage: string };

export interface ErrorMapperParams {
  errorMessage: string;
}

export type ErrorResponseType = AuthenticationError | ForbiddenError | UserInputError | ApolloError;

export default ({ errorType = '', errorMessage = '' }: ErrorParamsType): ErrorResponseType => {
  const errorHandler = genericErrorConfig[errorType];

  if (!errorHandler) {
    return new ApolloError(errorMessage || errorType);
  }

  return errorHandler({ errorMessage });
};
