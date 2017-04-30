// Packages
const _ = require('lodash');
const color = require('chalk');
const moment = require('moment');

module.exports = (defaultLevel) => {
  let self = {};
  self._levels = {
    'SILENT': 0,
    'ERROR': 1,
    'WARN': 2,
    'INFO': 3,
    'DEBUG': 4
  };
  let currentLevelNum = self._levels['INFO'];

  self.getLevel = () => {
    return currentLevelNum;
  };

  self.setLevel = (level) => {
    if (_.isString(level) && _.isNumber(self._levels[level.toUpperCase()])) {
      currentLevelNum = self._levels[level.toUpperCase()];
    } else {
      console.log(color.red('Error!') + ' The log-level "' + level + '" is unknown. ' +
        'The default option will be used.');
    }
  };

  self._printMessage = (txt, hideDate = false) => {
    const date = (hideDate === false ? color.gray('[' + moment().format('MMM Do, HH:mm:ss') + '] ') : '');
    console.log(date + txt);
  };

  self.logRequest = (code, method, url, userAgent = '') => {
    let message = '';

    if (code >= 200 && code <= 299) {
      message += color.green(code);
    } else if (code >= 300 && code <= 399) {
      message += color.yellow(code);
    } else if (code >= 400) {
      message += color.red(code);
    } else {
      message += color.blue(code);
    }

    message += ' ' + method + ' ' + url;

    if (currentLevelNum === self._levels.DEBUG) {
      message += '    ' + color.italic.gray(userAgent);
    }

    return message;
  };

  self.logSilent = (txt) => {
    return false;
  };

  self.logError = (txt, hideDate = false) => {
    if (currentLevelNum < 1) {
      return false;
    }

    self._printMessage(txt, hideDate);
  };
  // This function is an alias to error;
  self.log = self.logError;

  self.logWarn = (txt, hideDate = false) => {
    if (currentLevelNum < 2) {
      return false;
    }

    self._printMessage(txt, hideDate);
  };

  self.logInfo = (txt, hideDate = false) => {
    if (currentLevelNum < 3) {
      return false;
    }

    self._printMessage(txt, hideDate);
  };

  self.logDebug = (txt, hideDate = false) => {
    if (currentLevelNum < 4) {
      return false;
    }

    self._printMessage(color.gray(txt), hideDate);
  };

  // Set default log level
  self.setLevel(defaultLevel);

  return self;
};
