var jwt = require("jsonwebtoken");

const INVALID_TOKEN_ERR_MSG = "Invalid token";
const TOKEN_NOT_PROVIDED_ERR_MSG = "Authentication token not provided";

const signature = process.env.ACCESS_TOKEN_SECRET;
const expTime = process.env.ACCESS_TOKEN_EXP_TIME;

const createToken = ({ payload }) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, signature, { expiresIn: expTime }, (err, token) => {
      if (err) {
        return reject(err);
      }

      resolve(token);
    });
  });

const verifyToken = ({ token }) =>
  new Promise((resolve, reject) => {
    if (!token || typeof token !== "string" || !token.length) {
      return reject(new Error(TOKEN_NOT_PROVIDED_ERR_MSG));
    }

    jwt.verify(token, signature, function (err, decoded) {
      if (err) {
        return reject(new Error(INVALID_TOKEN_ERR_MSG));
      }

      resolve(decoded);
    });
  });

module.exports = {
  createToken,
  verifyToken,
};
