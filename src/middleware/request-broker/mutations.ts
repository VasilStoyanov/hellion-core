import { forkJoin, merge } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { mutationOptions } from '../../config/mutations';

export default new Promise(async (resolve) => {
  const { executeMutation } = await require('../../service');
  const authentication = await require('../authentication');
  const authorization = await require('../authorization');

  const mutationRequestHandler = ({ mutationName = '', params = {} }) => {
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
