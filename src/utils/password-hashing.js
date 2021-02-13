const { hash, compare, genSalt } = require("bcrypt");

const hashPassword = async (psw) => {
  const salt = await genSalt();
  const hashedPsw = await hash(psw, salt);

  return { hashedPsw };
};

const comparePasswords = ({ pasw, hash }) =>
  new Promise((resolve, reject) => {
    compare(pasw, hash, (err, succ) => {
      if (err) {
        return reject(err);
      }

      resolve(succ);
    });
  });

module.exports = {
  hashPassword,
  comparePasswords,
};
