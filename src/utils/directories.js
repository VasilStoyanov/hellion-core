const fileSystem = require("fs");
const path = require("path");

const isFile = (pathItem) => Boolean(path.extname(pathItem));
const isDirectory = (pathItem) => !Boolean(path.extname(pathItem));

const getAll = ({ operation }) => ({ directoryPath }) =>
  fileSystem.readdirSync(directoryPath).filter(operation);

const getAllFilesFor = getAll({ operation: isFile });
const getAllDirectoriesFor = getAll({ operation: isDirectory });

module.exports = {
  getAllDirectoriesFor,
  getAllFilesFor,
};
