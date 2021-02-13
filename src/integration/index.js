const { join } = require("path");
const { getAllDirectoriesFor } = require("../utils/directories");
const getExternalDependencies = require("../config/external-dependencies");

const moduleDirNames = getAllDirectoriesFor({
  directoryPath: __dirname,
});

module.exports = new Promise(async (resolve) => {
  const data = await moduleDirNames
    .map(async (dirname) => {
      const modulePath = join(__dirname, dirname);
      const initModule = require(modulePath);
      const { externalDependencies } = initModule;
      const moduleDependencies = await getExternalDependencies(
        externalDependencies
      );

      const currentModule = initModule(moduleDependencies);
      return {
        [dirname]: currentModule,
      };
    })
    .reduce(async (accP, curr) => {
      const acc = await accP;
      const currentModule = await curr;
      const currentModuleName = Object.keys(currentModule)[0];

      return {
        ...acc,
        [currentModuleName]: currentModule[currentModuleName],
      };
    }, Promise.resolve(Object.create(null)));

  resolve(data);
});
