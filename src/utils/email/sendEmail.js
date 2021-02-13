const { createTransport } = require("nodemailer");
const { EMAIL_NAME, EMAIL_SERVICE, EMAIL_PASSWORD } = process.env;
const passwordResetTemplate = require("./templates/passwordReset");

const fromTemplate = ({ templateName, params }) => {
  switch (templateName) {
    case "PASSWORD_RESET":
      return passwordResetTemplate({
        uuid: params.uuid,
        recipient: params.recipient,
      });
    default:
      throw new Error(`${templateName} does not exist.`);
  }
};

const sendEmail = ({
  recipient = "",
  subject = "",
  templateName = "",
  params = {},
}) => {
  const template = fromTemplate({
    templateName,
    params,
  });
  return createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_NAME,
      pass: EMAIL_PASSWORD,
    },
  }).sendMail({
    from: EMAIL_NAME,
    to: recipient,
    subject,
    html: template,
  });
};

module.exports = {
  sendEmail,
};
