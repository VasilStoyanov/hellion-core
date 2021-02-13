const registerUser = ({ usersCollection }) => async ({ user }) => {
  try {
    const dbResult = await usersCollection.insertOne(user);

    return {
      success: dbResult.result.ok === 1,
    };
  } catch (dbException) {
    return Promise.reject({
      message: dbException.errmsg,
    });
  }
};

const createUser = ({ usersCollection }) => async ({ user }) => {
  try {
    const dbResult = await usersCollection.insertOne(user);

    return {
      success: dbResult.result.ok === 1,
      id: dbResult.insertedId.toString(),
    };
  } catch (dbException) {
    return Promise.reject({
      message: dbException.errmsg,
    });
  }
};

const updatePassword = ({ usersCollection, ObjectId }) => async ({
  hashedPsw,
  userId,
}) => {
  try {
    const dbResult = await usersCollection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          hashedPsw,
        },
      }
    );

    return {
      success: dbResult.ok === 1,
    };
  } catch (dbException) {
    return Promise.reject({
      message: dbException.errmsg,
    });
  }
};

const confirmEmail = ({ usersCollection }) => async ({ email }) => {
  try {
    const dbResult = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          emailConfirmed: true,
        },
      }
    );

    return {
      success: dbResult.ok === 1,
    };
  } catch (dbException) {
    return Promise.reject({
      message: dbException.errmsg,
    });
  }
};

const setUserResetPasswordUUID = ({ usersCollection }) => async ({
  email,
  uuid,
}) => {
  try {
    const dbResult = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordUUID: uuid,
        },
      }
    );

    return {
      success: dbResult.ok === 1,
    };
  } catch (dbException) {
    return Promise.reject({
      message: dbException.errmsg,
    });
  }
};

const updateSubscription = ({ usersCollection, ObjectId }) => async ({
  subscribe,
  userId,
}) => {
  try {
    const dbResult = await usersCollection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          subscribe,
        },
      }
    );

    return {
      success: dbResult.ok === 1,
    };
  } catch (dbException) {
    return Promise.reject({
      message: dbException.errmsg,
    });
  }
};

module.exports = (externalDependencies) => {
  const {
    MongoDB_Native_Driver: { primaryDb: db, ObjectId },
  } = externalDependencies;

  const usersCollection = db.collection("users");

  return {
    registerUser: registerUser({ usersCollection }),
    createUser: createUser({ usersCollection }),
    updatePassword: updatePassword({ usersCollection, ObjectId }),
    confirmEmail: confirmEmail({ usersCollection }),
    updateSubscription: updateSubscription({ usersCollection, ObjectId }),
    setUserResetPasswordUUID: setUserResetPasswordUUID({ usersCollection }),
  };
};
