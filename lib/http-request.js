// Packages
const micro = require('micro');
const send = require('send');
const _ = require('lodash');

const sendServer = send;

module.exports = (fu) => {
  const printDebug = (type, args) => {
    return {type, args};
  };

  const parseOpts = opts => {
    opts.code = _.isNumber(opts.code) ? opts.code : null;
    opts.html = _.isString(opts.html) ? opts.html : null;
    opts.req = _.isObject(opts.req) ? opts.req : null;
    opts.path = _.isString(opts.path) ? opts.path : null;
    opts.streamOptions = _.isObject(opts.streamOptions) ? opts.streamOptions : null;
    opts.res = _.isObject(opts.res) ? opts.res : null;

    return opts;
  };

  const logRequests = (opts) => {
    // Ignore the core system requests
    if (_.isString(opts.req.url) && opts.req.url.indexOf(process.env.ASSET_DIR) === 0) {
      return false;
    }

    let message = global.utils.logger.logRequest(opts.code, opts.req.method, opts.req.url, opts.req.headers['user-agent']);

    if (_.includes([403, 500], opts.code)) {
      global.utils.logger.logError(message);
    } else if (_.includes([404], opts.code)) {
      global.utils.logger.logWarn(message);
    } else if (opts.code >= 200 && opts.code <= 299) {
      global.utils.logger.logInfo(message);
    } else {
      global.utils.logger.logInfo(message);
    }
  };

  return {
    logRequests,
    micro: opts => {
      opts = parseOpts(opts);

      if (_.isNull(opts.html)) {
        opts.html = fu.renderHttpError(opts.code);
      }

      logRequests(opts);
      micro
        .send(opts.res, opts.code, opts.html);
    },
    stream: opts => {
      opts = parseOpts(opts);

      // Default unknown types to text/plain
      // eslint-disable-next-line camelcase
      sendServer.mime.default_type = 'text/plain';

      // If we are here it means the file exists
      opts.code = 200;

      // Add a custom type
      sendServer.mime.define({
        'audio/wave': ['wav'],
        'application/x-httpd-php': ['php'],
        'audio/3gpp': ['3gpp'],
        'text/slim': ['slim'],
        'application/octet-stream': ['img']
      });

      logRequests(opts);
      sendServer(opts.req, opts.path, opts.streamOptions)
        .on('error', err => {
          printDebug('error', [err]);
        })
        .on('directory', (res, path) => {
          printDebug('directory', [res, path]);
        })
        .on('file', (path, stat) => {
          printDebug('file', [path, stat]);
        })
        .on('headers', (res, path, stat) => {
          printDebug('headers', [res, path, stat]);
        })
        .on('stream', (res, path, stat) => {
          printDebug('stream', [res, path, stat]);
        })
        .on('end', (res, path, stat) => {
          printDebug('end', [res, path, stat]);
        })
        .pipe(opts.res);
    }
  };
};
