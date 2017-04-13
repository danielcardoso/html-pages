// Packages
const ignore = require('ignore');

module.exports = function(ignoredFiles) {
  const ignorePattern = ignore().add(ignoredFiles);

  ignorePattern.isValidPath = function(path) {
    return !ignorePattern.ignores(path);
  };

  return ignorePattern;
};
