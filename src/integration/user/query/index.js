const getUserByField = ({ userCollection }) => ({ field, value }) =>
  userCollection.findOne({ [field]: value });

const getSubscribedUsers = ({ userCollection }) => () =>
  userCollection.find({ subscribe: true }).toArray();

module.exports = (extDependencies) => {
  const {
    MongoDB_Native_Driver: { primaryDb: db },
  } = extDependencies;

  const userCollection = db.collection("users");

  return {
    getSubscribedUsers: getSubscribedUsers({ userCollection }),
    getUserByField: getUserByField({ userCollection }),
  };
};
