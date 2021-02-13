const {
  MongoDB_Native_Driver,
} = require("../../config/external-dependencies/names");

module.exports = (dependencies) => ({
  queryOperations: require("./query")(dependencies),
  mutationOperations: require("./mutation")(dependencies),
});

module.exports.externalDependencies = [MongoDB_Native_Driver];
