// Packages
const _ = require('underscore');
const opn = require('opn');
const ignore = require('ignore');
const fileTypes = require('./file-types');
// const notifier = require('node-notifier');

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

  return utils;
};
