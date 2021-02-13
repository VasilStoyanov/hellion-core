const { Nodemailer } = require("../../../config/external-dependencies/names");

const sendEmail = ({ sendEmail }) => async ({
  recipient = "",
  subject = "",
  templateName = "",
  params = {},
}) => {
  try {
    await sendEmail({
      recipient,
      subject,
      templateName,
      params,
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = (externalDependencies) => {
  return {
    sendEmail: sendEmail(externalDependencies[Nodemailer]),
  };
};
