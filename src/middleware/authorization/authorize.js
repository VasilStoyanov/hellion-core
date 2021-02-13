const { AUTHORIZATION_ERROR } = require("../../config/errorTypes");

const USER_AUTHORIZED_SUCCESSFULLY = "User authorized successfully";
const USER_NOT_AUTHORIZED_MSG = "User not authorized";
const INALID_REQUIRED_ROLES_PROVIDED = "Invalid required roles provided";

const formatRoleCollection = (collection) =>
  collection
    .filter((el) => typeof el === "string")
    .map((str) => str.toLowerCase());

const authorizeUser = ({ requiredRoles, userRoles }) =>
  new Promise((resolve, reject) => {
    if (!Array.isArray(requiredRoles) || !Boolean(requiredRoles.length)) {
      return reject({
        errorType: AUTHORIZATION_ERROR,
        message: INALID_REQUIRED_ROLES_PROVIDED,
      });
    }

    if (!Array.isArray(userRoles) || !Boolean(userRoles.length)) {
      return reject({
        errorType: AUTHORIZATION_ERROR,
        message: USER_NOT_AUTHORIZED_MSG,
      });
    }

    const userIsAuthorized = formatRoleCollection(
      requiredRoles
    ).some((requiredRole) =>
      formatRoleCollection(userRoles).some(
        (userRole) => requiredRole === userRole
      )
    );

    if (!userIsAuthorized) {
      return reject({
        errorType: AUTHORIZATION_ERROR,
        message: USER_NOT_AUTHORIZED_MSG,
      });
    }

    resolve(USER_AUTHORIZED_SUCCESSFULLY);
  });

module.exports = new Promise(async (resolve) => {
  resolve(authorizeUser);
});
