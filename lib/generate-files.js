#!/usr/bin/env node

// Native
const path = require('path');

// Packages
const fs = require('fs-extra');
const _ = require('underscore');
const fileExists = require('file-exists');
const chalk = require('chalk');
const boxen = require('boxen');

// Others
const jsonPath = path.normalize(path.join(__dirname, '/../json/icons.json'));
const exampleFolder = path.normalize(path.join(__dirname, '/../example/'));
const minimalFilesList = [];
const fullFilesList = [];
let jsonObject = [];

try {
  jsonObject = require(jsonPath);
} catch (err) {
  throw err;
}

const statistics = {
  withIcon: [],
  withoutIcon: []
};

_.each(jsonObject, (item, key) => {
  const iconName = key.toLowerCase();
  const filePath = path.normalize(
    path.join(__dirname, '/../public/images/icons/' + iconName + '.png')
  );
  const iconExists = fileExists.sync(filePath);

  if (iconExists) {
    statistics.withIcon.push(iconName);
  } else {
    statistics.withoutIcon.push(iconName);
  }

  // Get extensions from aliases object
  if (_.isObject(item.aliases)) {
    _.each(item.aliases, alias => {
      if (_.isArray(alias.extensions)) {
        _.each(alias.extensions, (extension, key) => {
          const fileName = (extension.indexOf('.') === 0
            ? ''
            : alias.name + '.') + extension;

          if (iconExists) {
            if (key === 0) {
              minimalFilesList.push(fileName);
            }
            fullFilesList.push(fileName);
          }
        });
      }
    });
  }

  // Get extensions from syntaxes object
  if (_.isObject(item.syntaxes)) {
    _.each(item.syntaxes, syntax => {
      const scope = syntax.scope
        .replace(/( )/g, '')
        .replace(/(source|text|html)\./gi, '')
        .split(',');

      _.each(scope, (_scope, key) => {
        if (iconExists) {
          if (key === 0) {
            minimalFilesList.push(syntax.name + '.' + _scope);
          }
          fullFilesList.push(syntax.name + '.' + _scope);
        }
      });
    });
  }
});

// Empty example folder
fs.emptyDirSync(exampleFolder);
// Create empty folder
fs.mkdirSync(exampleFolder + 'Empty-Folder/');

// Create one file for each group of icons
_.each(minimalFilesList, file => {
  file = file.replace(/\//g, '-');
  fs.createFileSync(exampleFolder + file);
});

// Create one file for each extension
_.each(fullFilesList, file => {
  file = file.replace(/\//g, '-');
  fs.createFileSync(exampleFolder + 'All-Extensions/' + file);
});

const message = chalk.blue(`There are:\n`) +
  chalk.green(
    `    ${chalk.bold(`${_.size(statistics.withIcon)}`)} groups of extensions with icon!\n`
  ) +
  chalk.red(
    `    ${chalk.bold(`${_.size(statistics.withoutIcon)}`)} groups of extensions without icon!`
  );

console.log(
  boxen(message, {
    padding: 1,
    borderColor: 'grey',
    margin: 0
  })
);
