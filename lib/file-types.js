// Native
const path = require('path');

// Packages
const _ = require('underscore');
const fileExists = require('file-exists');

// Functions
const fixExtension = extension => {
  // If there's no dot in the extension add it
  if (extension.indexOf('.') < 0) {
    extension = '.' + extension;
  }

  return extension.toLowerCase();
};

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
  let extensionsJson = {};

  try {
    jsonObject = require(jsonPath);
  } catch (err) {
    throw err;
  }

  _.each(jsonObject, (item, key) => {
    const filePath = path.normalize(
      path.join(__dirname, '/../public/images/icons/' + key + '.png')
    );

    if (fileExists.sync(filePath)) {
      // Get extensions from aliases object
      _.each(item.aliases, alias => {
        if (_.isArray(alias.extensions)) {
          _.each(alias.extensions, extension => {
            extensionsJson[fixExtension(extension)] = key;
          });
        }
      });

      // Get extensions from syntaxes object
      _.each(item.syntaxes, syntax => {
        const scope = syntax.scope
          .replace(/( )/g, '')
          // .replace(/(source|text|js|html|log)\./gi, '')
          .split(',');

        _.each(scope, _scope => {
          _scope = fixExtension(_.last(_scope.split('.')));

          extensionsJson[_scope] = key;
        });
      });
    } else {
      delete jsonObject[key];
    }
  });

  extensionsJson = sortObjectByStringLength(extensionsJson);

  return (fileName, extension) => {
    if (fileName.indexOf('.') < 0 && _.isEmpty(extension)) {
      return 'file_type_default';
    }

    fileName = fileName.toLowerCase();
    extension = ('file_type_' + extension).toLowerCase();

    const fileNameHasExtension = _.filter(extensionsJson, (item, key) => {
      key = key.replace(/(\+|\.)/g, '\\$1');

      return new RegExp(key + '$').test(fileName);
    });

    if (_.isString(_.first(fileNameHasExtension))) {
      return _.first(fileNameHasExtension);
    } else if (_.isObject(jsonObject[extension])) {
      return extension;
    }

    return 'file_type_default';
  };
};
