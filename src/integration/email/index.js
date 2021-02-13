const { Nodemailer } = require("../../config/external-dependencies/names");

module.exports = (dependencies) => ({
  mutationOperations: require("./mutation")(dependencies),
});

module.exports.externalDependencies = [Nodemailer];
