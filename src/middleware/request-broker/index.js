module.exports = new Promise(async (resolve) => {
  const handleQuery = await require("./queries");
  const handleMutation = await require("./mutations");

  resolve({ handleQuery, handleMutation });
});
