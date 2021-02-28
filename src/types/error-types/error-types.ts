import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-express";

export type ErrorParamsType = { errorType: string; errorMessage: string };

export interface ErrorMapperParams {
    errorMessage: string;
}

export type ErrorResponseType = AuthenticationError | ForbiddenError | UserInputError | ApolloError;