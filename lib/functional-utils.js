// Native
const path = require('path');
const http = require('http');

// Packages
const fs = require('fs-promise');
const _ = require('lodash');
const opn = require('opn');
const ignore = require('ignore');
const notifier = require('node-notifier');
const compile = require('handlebars').compile;
const performanceNow = require('performance-now');

// Ours
const pkg = require('../package');
const fileTypes = require('./file-types');

module.exports = (opts, ignoredFiles) => {
  const utils = {};
  const ignorePattern = ignore().add(ignoredFiles);

  utils.openInBrowser = (url) => {
    if (_.isBoolean(opts.open) && opts.open !== true) {
      return false;
    }

    const browsersList = ['chrome', 'safari', 'firefox'];
    let browser = _.isString(opts.browser) ? opts.browser.toLowerCase() : '';
    const options = {};

    if (!_.includes(browsersList, browser)) {
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
    if (_.isBoolean(opts.notifications) && opts.notifications === false) {
      return false;
    }

    notifier.notify({
      title: pkg.title,
      icon: path.join(__dirname, '../public/images/logo.png'),
      sound: true,
      message: message
    });
  };

  // Render HTTP Error page
  let notFoundResponse = false;

  try {
    const view404Path = path.normalize(
      path.join(__dirname, '/../views/errors.hbs')
    );
    notFoundResponse = fs.readFileSync(view404Path, 'utf8');
    notFoundResponse = compile(notFoundResponse);
  } catch (err) {}

  utils.renderHttpError = (code) => {
    // Load specific HTML error file if exists
    try {
      const customErrorPath = path.join(process.env.CURRENT_PATH, '/' + code + '.html');
      return fs.readFileSync(customErrorPath, 'utf-8');
    } catch (err) {}

    // Shows custom HTML error
    const titleObj = {
      403: 'Forbidden',
      404: 'Sorry but we couldn\'t find this page'
    };
    const infoObj = {
      403: 'You don\'t have permission to access this directory on this server!',
      404: 'Sorry but we couldnt find this page'
    };

    const title = _.isString(titleObj[code]) ? titleObj[code] : http.STATUS_CODES[code];
    const info = _.isString(infoObj[code]) ? infoObj[code] : '';

    if (notFoundResponse === false) {
      return title + (!_.isEmpty(info) ? ': ' + info : info);
    }

    return notFoundResponse({
      structure: {
        name: pkg.title,
        link: pkg.npmJsLink,
        assetDir: process.env.ASSET_DIR,
        description: pkg.desc
      },
      error: {
        code,
        msg: title,
        info: info
      }
    });
  };

  utils.getMsTime = () => {
    return performanceNow();
  };

  return utils;
};
