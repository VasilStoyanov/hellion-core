const { MongoClient } = require("mongodb");
const { hashPassword } = require("../../../utils/password-hashing");

const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  console.error("> Cannot create dev admin in production env!");
  process.exit(1);
}

const mongoDBUrl = process.env.MONGODB_URL;
const dbName = "romanspiration-dev";

const createDevAdmin = async (db) => {
  const { hashedPsw } = await hashPassword("123");
  try {
    await db.collection("users").insertOne({
      username: "admin",
      hashedPsw,
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "Adminov",
      roles: ["ADMIN"],
      emailConfirmationUuid: "0eaeb1dc-fc5b-4a07-bedb-237008ffa383",
      emailConfirmed: true,
    });
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }

  return db;
};

MongoClient.connect(mongoDBUrl, { useUnifiedTopology: true })
  .then((client) => client.db(dbName))
  .then(createDevAdmin)
  .then(() => console.log("Done ✔️") || process.exit())
  .catch((err) => console.error(err));
