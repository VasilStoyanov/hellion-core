const { from, throwError } = require("rxjs");
const { mergeMap, map, tap, catchError } = require("rxjs/operators");

const {
  MUTATION_NAMES: { SEND_EMAIL },
} = require("../../config/mutations");

const { SEND_EMAIL_FAILED } = require("../../config/errorTypes");

const sendEmailProcess = ({ sendEmail }) => ({ params }) =>
  from(sendEmail(params)).pipe(
    map(() => ({
      success: true,
    })),
    catchError((e) =>
      throwError({
        errorType: SEND_EMAIL_FAILED,
        message: e,
      })
    )
  );

module.exports = (integrationDependencies) => {
  const { sendEmail } = integrationDependencies;
  return {
    [SEND_EMAIL]: ({ params }) => sendEmailProcess({ sendEmail })({ params }),
  };
};

module.exports.integrationDependencies = ["email"];
