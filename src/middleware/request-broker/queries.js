const { forkJoin, merge } = require("rxjs");
const { mergeMap } = require("rxjs/operators");
const { queryOptions } = require("../../config/queries");

module.exports = new Promise(async (resolve) => {
  const { executeQuery } = await require("../../service");
  const authentication = await require("../authentication");
  const authorization = await require("../authorization");

  const queryRequestHandler = ({ queryName = "", params = {} }) => {
    const queryRequestOptions = queryOptions[queryName];
    const { token, ...rest } = params;

    const authentication$ = authentication({
      token,
      requestOptions: queryRequestOptions,
    });

    const authorization$ = authorization({
      token,
      requestOptions: queryRequestOptions,
    });

    return forkJoin([merge(authentication$, authorization$)])
      .pipe(
        mergeMap(([user]) =>
          executeQuery({
            queryName,
            params: {
              ...(user && {
                user,
              }),
              ...rest,
            },
          })
        )
      )
      .toPromise();
  };

  resolve(queryRequestHandler);
});
