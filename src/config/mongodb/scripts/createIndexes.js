const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URL;
const isproduction = process.env.NODE_ENV === "production";
const dbName = `romanspiration${isproduction ? "" : "-dev"}`;

const createUsersIndexes = async (db) => {
  try {
    await db
      .collection("users")
      .createIndex({ username: "text" }, { unique: true });
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }

  return db;
};

const createArticleIndexes = async (db) => {
  try {
    await db
      .collection("articles")
      .createIndex({ name: "text" }, { unique: true });
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }

  return db;
};

MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => client.db(dbName))
  .then(createUsersIndexes)
  .then(createArticleIndexes)
  .then(() => console.log("Done ✔️") || process.exit())
  .catch((err) => console.error(err));
