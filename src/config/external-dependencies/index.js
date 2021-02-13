const { MongoDB_Native_Driver, Nodemailer } = require("./names");

const MISSING_DEPENDENCY_WARN_MSG = ({ requestedDependency }) =>
  `⚠️ Requested dependency ${requestedDependency} is not configured`;

const externalDependencies = {
  [MongoDB_Native_Driver]: () => require("../mongodb"),
  [Nodemailer]: () => require("./nodemailer"),
};

module.exports = (...requestedDependenciesList) =>
  requestedDependenciesList
    .map((depenedencyName) =>
      typeof externalDependencies[depenedencyName] === "function"
        ? { [depenedencyName]: externalDependencies[depenedencyName]() }
        : console.warn(
            MISSING_DEPENDENCY_WARN_MSG({
              requestedDependency: depenedencyName,
            })
          ) || undefined
    )
    .filter(Boolean)
    .reduce(async (accP, curr) => {
      const moduleName = Object.keys(curr)[0];
      const moduleExportsFunction = typeof curr[moduleName] === "function";

      const acc = await accP;
      const module = moduleExportsFunction
        ? await curr[moduleName]()
        : await curr[moduleName];

      return {
        ...acc,
        [moduleName]: module,
      };
    }, Promise.resolve(Object.create(null)));
