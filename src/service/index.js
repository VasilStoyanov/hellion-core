const { join } = require("path");
const { getAllFilesFor } = require("../utils/directories");

const FAILED_TO_LOAD_MODULE_ERR_MSG = ({ pathToModule }) => `
> [SERVICE|ERROR] Failed to load module: ${pathToModule}
`;

const MISSING_MODULE_ERR_MSG = ({ type, name }) => `
> [SERVICE|ERROR] Missing module for ${type}: "${name}"
`;

const moduleExist = ({ requiredModule }) =>
  typeof requiredModule === "function";

const getModuleDependencies = ({ dependenciesList, fromSource: source }) =>
  Boolean(dependenciesList && dependenciesList.length)
    ? dependenciesList.reduce((acc, curr) => {
        const integrationModule = source[curr];
        const [queryOperations, mutationOperations] = Object.keys(
          integrationModule
        );

        return {
          ...(queryOperations && {
            [queryOperations]: {
              ...acc.queryOperations,
              ...integrationModule[queryOperations],
            },
          }),
          ...(mutationOperations && {
            [mutationOperations]: {
              ...acc.mutationOperations,
              ...integrationModule[mutationOperations],
            },
          }),
        };
      }, Object.create(null))
    : {};

module.exports = new Promise(async (resolve) => {
  const integrationModule = await require("../integration");

  const queryModules = getAllFilesFor({
    directoryPath: `${__dirname}/queries`,
  }).reduce((acc, file) => {
    const modulePath = join(__dirname, `./queries/${file}`);
    const requiredModule = require(modulePath);

    if (!moduleExist({ requiredModule })) {
      console.error(
        FAILED_TO_LOAD_MODULE_ERR_MSG({ pathToModule: `./queries/${file}` })
      );

      return {
        ...acc,
      };
    }

    const { queryOperations } = getModuleDependencies({
      fromSource: integrationModule,
      dependenciesList: requiredModule.integrationDependencies,
    });

    const initializedModule = requiredModule(queryOperations);

    return {
      ...acc,
      ...initializedModule,
    };
  }, {});

  const mutationModules = getAllFilesFor({
    directoryPath: `${__dirname}/mutations`,
  }).reduce((acc, file) => {
    const modulePath = join(__dirname, `./mutations/${file}`);
    const requiredModule = require(modulePath);

    if (!moduleExist({ requiredModule })) {
      console.error(
        FAILED_TO_LOAD_MODULE_ERR_MSG({ pathToModule: `./mutations/${file}` })
      );
      return {
        ...acc,
      };
    }

    const { queryOperations, mutationOperations } = getModuleDependencies({
      fromSource: integrationModule,
      dependenciesList: requiredModule.integrationDependencies,
    });

    const initializedModule = requiredModule({
      ...queryOperations,
      ...mutationOperations,
    });

    return {
      ...acc,
      ...initializedModule,
    };
  }, {});

  const executeQuery = ({ queryName, params }) =>
    typeof queryModules[queryName] === "function"
      ? queryModules[queryName]({
          params,
          executeQuery,
        })
      : (() => {
          console.error(
            MISSING_MODULE_ERR_MSG({ type: "query", name: queryName })
          );
        })();

  const executeMutation = ({ mutationName, params }) =>
    typeof mutationModules[mutationName] === "function"
      ? mutationModules[mutationName]({
          params,
          executeQuery,
          executeMutation,
        })
      : (() => {
          console.error(
            MISSING_MODULE_ERR_MSG({ type: "mutation", name: mutationName })
          );
        })();

  resolve({
    executeQuery,
    executeMutation,
  });
});
