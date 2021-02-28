import handleError from './errorsMapper';
import { QUERY_NAMES } from '../../config/queries/queries';
import { ErrorParamsType, ErrorResponseType } from './errorsMapper';
import { MUTATION_NAMES } from '../../config/mutations/';

const NOT_IMPLEMENTED_ERR_MSG = ({ name }: { name: string }): string => `${name} not implemented`;
const isproduction = process.env.NODE_ENV === 'production';

interface DefaultObserverType<T> {
  next: (data: T) => Promise<T>;
  error: (error: ErrorParamsType) => Promise<ErrorResponseType>;
  complete: () => void;
}

export default <T>({
  resolve,
  reject,
  name,
}: {
  resolve: (data: T) => Promise<T>;
  reject: (errorResponse: ErrorResponseType) => Promise<ErrorResponseType>;
  name: string;
}): DefaultObserverType<T> => {
  const queryType = Boolean(QUERY_NAMES[name]) ? 'Query' : Boolean(MUTATION_NAMES[name]) ? 'Mutation' : undefined;

  if (!queryType) {
    throw new Error(NOT_IMPLEMENTED_ERR_MSG({ name }));
  }

  return {
    next: (data) => resolve(data),
    error: (error) => reject(handleError(error)),
    complete: () => {
      if (isproduction) return;
      console.info(`${queryType} ${name} completed`);
    },
  };
};
