import { forkJoin, merge } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HandleMutationsParamsType } from '../../api/resolvers/user';
import { mutationOptions } from '../../config/mutations';

export interface TokenType {
  token?: string
}
export interface MutationRequestHandlerType<T> {
  mutationName: string;
  params: HandleMutationsParamsType<T> & TokenType;
}

export default new Promise(async (resolve) => {
  const { executeMutation } = await require('../../service');
  const authentication = await require('../authentication');
  const authorization = await require('../authorization');

  const mutationRequestHandler = <T>({ mutationName = '', params = {} }: MutationRequestHandlerType<T>) => {
    const mutationRequestOptions = mutationOptions[mutationName];
    const { token, ...rest } = params;

    const authentication$ = authentication({
      token,
      requestOptions: mutationRequestOptions,
    });

    const authorization$ = authorization({
      token,
      requestOptions: mutationRequestOptions,
    });

    return forkJoin([merge(authentication$, authorization$)])
      .pipe(
        mergeMap(([user]) =>
          executeMutation({
            mutationName,
            params: {
              ...(user && {
                user,
              }),
              ...rest,
            },
          }),
        ),
      )
      .toPromise();
  };

  resolve(mutationRequestHandler);
});
