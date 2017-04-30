// Native
const path = require('path');

// Packages
const mlog = require('mocha-logger');
const _ = require('lodash');
const sleep = require('thread-sleep');
const request = require('urllib-sync').request;

const options = {
  'no-notifications': true,
  'log-level': 'silent',
  'no-port-scan': true,
  port: 8888
};

const httpHost = 'http://localhost:' + options.port;

try {
  // Check if the server is online
  request(httpHost);

  mlog.error('There is a server already running under the host \'' + httpHost + '\'');
  process.exit(500);
} catch (err) {
}

const startServer = (opts = {}, dirname) => {
  let htmlPages = null;

  const checkIfServerIsOnline = (retries = 0) => {
    try {
      // Check if the server is online
      request(httpHost + '/@server-status::check-if-server-is-already-up');

      return true;
    } catch (err) {
      if (retries >= 25) {
        mlog.error('Can\'t connect to ' + httpHost + '. Number of retries: ' + retries);
        process.exit(1);
      }

      sleep(50);
    }
    retries++;

    return checkIfServerIsOnline(retries);
  };

  opts = _.merge({}, options, opts);

  if (dirname === undefined) {
    dirname = path.join(__dirname, 'data');
  }

  htmlPages = require('../lib/api')(dirname, opts);

  if (checkIfServerIsOnline() === false) {
    checkIfServerIsOnline();
  }

  return {
    htmlPages,
    httpHost
  };
};

const parseResponse = (response, debug) => {
  if (debug !== true) {
    return false;
  }

  mlog.log('response', Object.keys(response));
  mlog.log('status', response.status);
  mlog.log('statusCode', response.statusCode);

  for (const _header in response.headers) {
    mlog.log('_header', _header, response.headers[_header]);
  }
};

module.exports = {
  startServer,
  parseResponse
};
