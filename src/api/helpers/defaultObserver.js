const handleError = require("./errorsMapper");
const { QUERY_NAMES } = require("../../config/queries/queries");
const { MUTATION_NAMES } = require("../../config/mutations/");

const NOT_IMPLEMENTED_ERR_MSG = ({ name }) => `${name} not implemented`;
const isproduction = process.env.NODE_ENV === "production";

module.exports = ({ resolve, reject, name }) => {
  const queryType = Boolean(QUERY_NAMES[name])
    ? "Query"
    : Boolean(MUTATION_NAMES[name])
    ? "Mutation"
    : undefined;

  if (!queryType) {
    throw new Error(NOT_IMPLEMENTED_ERR_MSG({ name }));
  }

  return {
    next: (data) => resolve(data),
    error: (error) => reject(handleError({ error })),
    complete: () => {
      if (isproduction) return;
      console.info(`${queryType} ${name} completed`);
    },
  };
};
