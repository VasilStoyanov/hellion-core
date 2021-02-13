const { MongoClient, ObjectId } = require("mongodb");

const url = process.env.MONGODB_URL;
const isproduction = process.env.NODE_ENV === "production";
const dbName = `Hellion-Test${isproduction ? "" : "-dev"}`;

const renamePropertyInObject = ({ object }) => ({
  propertyToBeRenamed = "",
  newValue = "",
}) =>
  Object.entries(object).reduce(
    (acc, [key, value]) =>
      key === propertyToBeRenamed
        ? { ...acc, [newValue]: value }
        : { ...acc, [key]: value },
    {}
  );

module.exports = new Promise((resolve, reject) => {
  MongoClient.connect(url, { useUnifiedTopology: true })
    .then((client) =>
      resolve({
        client,
        primaryDb: client.db(dbName),
        primaryDbName: dbName,
        env: process.env.NODE_ENV,
        ObjectId,
        utils: {
          renamePropertyInObject,
        },
      })
    )
    .catch((err) => reject(err));
});
