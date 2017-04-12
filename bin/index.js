#!/usr/bin/env node

// Native
const path = require('path');

// Packages
const micro = require('micro');
const args = require('args');
const fs = require('fs-extra');
const compress = require('micro-compress');
const detect = require('detect-port');
const { coroutine } = require('bluebird');
const updateNotifier = require('update-notifier');
const { red } = require('chalk');
const nodeVersion = require('node-version');
const _ = require('underscore');

// eslint-disable-next-line no-unused-vars
const assign = require('object-assign');


// Ours
const pkg = require('../package');
const listening = require('../lib/listening');
const serverHandler = require('../lib/server');
const ignore = require('../lib/ignore');

// Throw an error if node version is too low
if (nodeVersion.major < 6) {
  console.error(
    `${red('Error!')} ${pkg.title} requires at least version 6 of Node. Please upgrade!`
  );
  process.exit(1);
}

// Let user know if there's an update
// This isn't important when deployed to production
if (process.env.NODE_ENV !== 'production' && pkg.dist) {
  updateNotifier({
    pkg
  }).notify();
}

const argsOptsFilePath = path.normalize(path.join(__dirname, '/../json/args.json'));
const jsonArgs = fs.readJsonSync(argsOptsFilePath);

if (!_.isObject(jsonArgs.options)) {
  console.error(
    `${red('Error!')} Arguments file is not available!`
  );
  process.exit(1);
}

const argsBoolean = _.chain(jsonArgs.options)
  .map((arg) => {
    return (_.isBoolean(arg.isBoolean) && arg.isBoolean === true) ? arg.name : undefined;
  })
  .filter((arg) => {
    return !_.isUndefined(arg);
  })
  .value();

args
  .options(jsonArgs.options);

const flags = args.parse(process.argv, {
  name: pkg.name,
  help: true,
  version: true,
  minimist: {
    stopEarly: false,
    alias: {},
    boolean: argsBoolean
  },
  mainColor: ['yellow', 'bold']
});


// eslint-disable-next-line capitalized-comments
/*
const userHomeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
const userConfigPath = path.join(userHomeDir, '.html-pages.json');

let userConfig = {};
if (fs.existsSync(userConfigPath)) {
  try {
    userConfig = fs.readJsonSync(userConfigPath);
  } catch (err) {
    console.error(
      `${red('Error!')} ${err}`
    );
    process.exit(1);
  }

  if (!_.isObject(userConfig)) {
    console.error(
      `${red('Error!')} The .html-pages.json is defined but the content isn't an object. Please check if!`
    );
    process.exit(1);
  }
}
*/

// Validate options
if (flags.directoryIndex.toLowerCase() === 'false') {
  flags.directoryIndex = false;
}
if (flags.cache === 0) {
  flags.noCache = true;
}

const directory = args.sub[0];

// Don't log anything to the console if silent mode is enabled
if (flags.silent) {
  console.log = () => {};
}

process.env.ASSET_DIR = '/' + Math.random().toString(36).substr(2, 10);

let current = process.cwd();

if (directory) {
  current = path.resolve(process.cwd(), directory);
}

// Ignore MacOSx files
let ignoredFiles = ['.DS_Store', '._.DS_Store'];

if (flags.ignore && flags.ignore.length > 0) {
  ignoredFiles = ignoredFiles.concat(flags.ignore.split(','));
}

const handler = coroutine(function*(req, res) {
  const ignorePattern = ignore(ignoredFiles);

  yield serverHandler(req, res, flags, current, ignorePattern);
});

const server = flags.unzipped ? micro(handler) : micro(compress(handler));
let port = flags.port;

detect(port).then(open => {
  let inUse = open !== port;

  if (inUse) {
    port = open;

    inUse = {
      old: flags.port,
      open
    };
  }

  server.listen(
    port,
    coroutine(function*() {
      yield listening(server, current, inUse, flags.noClipboard !== true);
    })
  );
});
