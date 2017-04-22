// Native
const path = require('path');

// Packages
const _ = require('lodash');
const opn = require('opn');
const ignore = require('ignore');
const notifier = require('node-notifier');

// Ours
const pkg = require('../package');
const fileTypes = require('./file-types');

module.exports = (opts, ignoredFiles) => {
  const utils = {};
  const ignorePattern = ignore().add(ignoredFiles);

  utils.openInBrowser = (url) => {
    if (_.isBoolean(opts.noBrowser) && opts.noBrowser === true) {
      return false;
    }

    const browsersList = ['chrome', 'safari', 'firefox'];
    let browser = _.isString(opts.browser) ? opts.browser.toLowerCase() : '';
    let options = {};

    if (!_.contains(browsersList, browser)) {
      browser = '';
    }

    if (browser === 'chrome') {
      if (process.platform === 'darwin') {
        browser = 'google chrome';
      } else if (process.platform === 'linux') {
        browser = 'google-chrome';
      } else if (process.platform === 'win32') {
        browser = 'Chrome';
      }
    }

    if (!_.isEmpty(browser)) {
      options.app = browser;
    }

    opn(url, options);
  };

  utils.isNotIgnoredPath = (path) => {
    return !ignorePattern.ignores(path);
  };

  utils.getIconFromFileName = fileTypes();

  utils.notify = (message) => {
    if (_.isBoolean(opts.noNotifications) && opts.noNotifications === true) {
      return false;
    }

    notifier.notify({
      title: pkg.title,
      icon: path.join(__dirname, '../public/images/logo.png'),
      sound: true,
      message: message
    });
  };

  return utils;
};
