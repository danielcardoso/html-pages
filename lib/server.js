// Native
const path = require('path');
const { parse, format } = require('url');

// Packages
const auth = require('basic-auth');
const { red } = require('chalk');
const fs = require('fs-promise');
const pathType = require('path-type');
const mime = require('mime-types');
const { coroutine } = require('bluebird');
const { compile } = require('handlebars');

// Ours
const pkg = require('../package');
const renderDirectory = require('./render');
const fileTypes = require('./file-types');
const httpRequestObj = require('./http-request');

// Functions
const getIconFromFileName = fileTypes();
const httpRequest = httpRequestObj();

module.exports = coroutine(function * (req, res, flags, current, fu) {
  const headers = {};

  if (flags.cors) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Range';
  }

  for (const header in headers) {
    if (!{}.hasOwnProperty.call(headers, header)) {
      continue;
    }

    res.setHeader(header, headers[header]);
  }

  // If the http-auth option is available
  if (flags.auth) {
    const credentials = auth(req);

    if (!process.env.PAGES_USER || !process.env.PAGES_PASSWORD) {
      console.error(
        red(
          'You are running `' +
            pkg.name +
            '` with basic auth but did not set the ' +
            '`PAGES_USER` and `PAGES_PASSWORD` environment variables.'
        )
      );

      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }

    if (
      !credentials ||
      credentials.name !== process.env.PAGES_USER ||
      credentials.pass !== process.env.PAGES_PASSWORD
    ) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm"');

      return httpRequest.micro({
        res,
        code: 401,
        html: 'Access Denied'
      });
    }
  }

  const {
    pathname
  } = parse(req.url);
  const assetDir = path.normalize(process.env.ASSET_DIR);

  let related = path.parse(path.join(current, pathname));

  if (related.dir.indexOf(assetDir) > -1) {
    const relative = path.relative(assetDir, pathname);
    related = path.parse(path.join(__dirname, '/../public', relative));
  }

  related = decodeURIComponent(path.format(related));

  const relatedExists = fs.existsSync(related);
  let notFoundResponse = 'Not Found';

  // Read the 404 page from server
  try {
    const view404Path = path.normalize(
      path.join(__dirname, '/../views/error-404.hbs')
    );
    notFoundResponse = fs.readFileSync(view404Path, 'utf8');
    notFoundResponse = compile(notFoundResponse);
    notFoundResponse = notFoundResponse({
      structure: {
        assetDir
      }
    });
  } catch (err) {}

  // Read the 404 page from local folder
  try {
    const custom404Path = path.join(current, '/404.html');
    notFoundResponse = yield fs.readFile(custom404Path, 'utf-8');
  } catch (err) {}

  // If not exists return an error 404
  if (!relatedExists) {
    return httpRequest.micro({
      res,
      code: 404,
      html: notFoundResponse
    });
  }

  const streamOptions = {};

  if (flags.cache) {
    streamOptions.maxAge = flags.cache;
  }

  // Check if directory
  if (pathType.dirSync(related)) {
    const url = parse(req.url);

    // If the url doesn't end with a slash, add it and redirect the page
    if (url.pathname.substr(-1) !== '/') {
      url.pathname += '/';
      const newPath = format(url);

      res.writeHead(301, {
        Location: newPath
      });

      res.end('Redirecting to ' + newPath);
      return;
    }

    const directoryIndexPath = path.join(related, '/' + flags.directoryIndex);

    // If exists open the directory index file
    if (flags.directoryIndex !== false && fs.existsSync(directoryIndexPath)) {
      res.setHeader(
        'Content-Type',
        mime.contentType(path.extname(directoryIndexPath))
      );

      return httpRequest.stream({
        req,
        path: directoryIndexPath,
        streamOptions,
        res
      });
    }

    // If no listing is available return an error 403
    if (flags.noListing === true) {
      return httpRequest.micro({
        res,
        code: 403,
        html: "Forbidden: You don't have permission to access this directory on this server!"
      });
    }

    // Try to render the current directory's content
    const port = flags.port || req.socket.localPort;
    const renderedDir = yield renderDirectory(
      port,
      current,
      related,
      fu,
      getIconFromFileName
    );

    // If it works, send the directory listing to the user
    if (renderedDir) {
      return httpRequest.micro({
        res,
        code: 200,
        html: renderedDir
      });
    }

    return httpRequest.micro({
      res,
      code: 500,
      html: '500 fix it!'
    });
  }

  return httpRequest.stream({
    req,
    path: related,
    streamOptions: Object.assign(
      {
        dotfiles: 'allow',
        cacheControl: flags.noCache === true
      },
      streamOptions
    ),
    res
  });
});
