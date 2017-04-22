// Packages
const micro = require('micro');
const send = require('send');
const _ = require('lodash');

const sendServer = send;

module.exports = () => {
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

  return {
    micro: opts => {
      opts = parseOpts(opts);

      micro.send(opts.res, opts.code, opts.html);
    },
    stream: opts => {
      opts = parseOpts(opts);

      // Default unknown types to text/plain
      // eslint-disable-next-line camelcase
      sendServer.mime.default_type = 'text/plain';

      // Add a custom type
      sendServer.mime.define({
        'audio/wave': ['wav'],
        'application/x-httpd-php': ['php'],
        'audio/3gpp': ['3gpp'],
        'text/slim': ['slim'],
        'application/octet-stream': ['img']
      });

      sendServer(opts.req, opts.path, opts.streamOptions)
        .on('error', err => {
          printDebug([err]);
        })
        .on('directory', (res, path) => {
          printDebug([res, path]);
        })
        .on('headers', (res, path, stat) => {
          printDebug([res, path, stat]);
        })
        .pipe(opts.res);
    }
  };
};
