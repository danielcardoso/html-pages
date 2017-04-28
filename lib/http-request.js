// Packages
const micro = require('micro');
const send = require('send');
const _ = require('lodash');
const color = require('chalk');
const moment = require('moment');

const sendServer = send;

module.exports = (fu) => {
  const printDebug = args => {
    return args;
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

  const logRequests = (opts, type) => {
    if (_.isString(opts.req.url) && opts.req.url.indexOf(process.env.ASSET_DIR) === 0) {
      return false;
    }

    let message = color.gray('[' + moment().format('MMM Do, hh:mm:ss') + '] ');

    // console.log('\n\n\nopts.req', type, opts.req);
    // console.log('opts.req.url', opts.req.url);
    // console.log('opts.req.method', opts.req.method);
    // console.log('opts.req.statusCode', opts.req.statusCode);
    // console.log('opts.req.statusMessage', opts.req.statusMessage);
    // // console.log('opts.req.client', opts.req.client);

    // message += '[';
    if (_.includes([403, 500], opts.code)) {
      message += color.red(opts.code);
    } else if (_.includes([404], opts.code)) {
      message += color.yellow(opts.code);
    } else if (opts.code >= 200 && opts.code <= 299) {
      message += color.green(opts.code);
    } else {
      message += color.blue(opts.code);
    }
    // message += ']';

    message += ' ';
    // message += _.padEnd(opts.req.method, 5);
    message += opts.req.method;
    message += ' ' + opts.req.url;

    console.log(message);
  };

  return {
    logRequests,
    micro: opts => {
      opts = parseOpts(opts);

      if (_.isNull(opts.html)) {
        opts.html = fu.renderHttpError(opts.code);
      }

      logRequests(opts, 'micro');
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

      logRequests(opts, 'stream');
      sendServer(opts.req, opts.path, opts.streamOptions)
        .on('error', err => {
          // console.log('error');
          printDebug([err]);
        })
        .on('directory', (res, path) => {
          // console.log('directory');
          printDebug([res, path]);
        })
        .on('file', (path, stat) => {
          // console.log('file');
          printDebug([path, stat]);
        })
        .on('headers', (res, path, stat) => {
          // console.log('headers');
          printDebug([res, path, stat]);
        })
        .on('stream', (res, path, stat) => {
          // console.log('stream');
          printDebug([res, path, stat]);
        })
        .on('end', (res, path, stat) => {
          // console.log('end');
          printDebug([res, path, stat]);
        })
        .pipe(opts.res);
    }
  };
};
