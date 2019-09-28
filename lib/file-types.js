// Native
const path = require('path');

// Packages
const _ = require('lodash');

const sortObjectByStringLength = obj => {
  const finalObject = {};

  // Get the array of keys
  const keys = Object.keys(obj);

  // Sort the keys in descending order
  keys.sort((a, b) => {
    return b.length - a.length;
  });

  _.each(keys, item => {
    finalObject[item] = obj[item];
  });

  return finalObject;
};

module.exports = () => {
  const jsonPath = path.normalize(path.join(__dirname, '/../json/icons.json'));
  let jsonObject = false;

  function getDefaultIcon (isFile = true) {
    const defaultIcon = (isFile ? jsonObject.file_default : jsonObject.folder_default);

    return jsonObject.iconDefinitions[defaultIcon].iconPath;
  }

  jsonObject = require(jsonPath);

  // Validate if every icon is readable
  _.each(['folderNames', 'fileNames', 'fileExtensions'], (type) => {
    jsonObject[type] = sortObjectByStringLength(jsonObject[type]);
  });

  return (fileName = '', extension = '', isFolder = false, isParent = false) => {
    let fileNameHasExtension;

    if (isParent) {
      return jsonObject.iconDefinitions[jsonObject.folder_default_parent].iconPath;
    }

    if (isFolder) {
      if (_.isString(jsonObject.folderNames[_.toLower(fileName)])) {
        return jsonObject.iconDefinitions[jsonObject.folderNames[_.toLower(fileName)]].iconPath;
      }

      return getDefaultIcon(false);
    } else {
      // Check by filename
      if (_.isString(jsonObject.fileNames[_.toLower(fileName)])) {
        return jsonObject.iconDefinitions[jsonObject.fileNames[_.toLower(fileName)]].iconPath;
      }

      // // Check by extensions
      fileNameHasExtension = _.filter(jsonObject.fileExtensions, (item, key) => {
        key = key.replace(/(\+|\.)/g, '\\$1');
        return new RegExp(key + '$').test(fileName);
      });

      if (_.size(fileNameHasExtension) !== 0) {
        return jsonObject.iconDefinitions[_.first(fileNameHasExtension)].iconPath;
      }
    }

    return getDefaultIcon();
  };
};
