#!/usr/bin/env node

// Native
const path = require('path');

// Packages
const micro = require('micro');
const compress = require('micro-compress');
const detect = require('detect-port');
const { coroutine } = require('bluebird');
const updateNotifier = require('update-notifier');
const { red } = require('chalk');
const nodeVersion = require('node-version');

// Ours
const pkg = require('../package');
const listening = require('../lib/listening');
const serverHandler = require('../lib/server');
const FunctionalUtils = require('../lib/functional-utils');
const ParseCommandLineArgs = require('../lib/parse-command-line-args');

let HtmlPages = {
  server: null,
  logLevel: 2
};

// Throw an error if node version is too low
if (nodeVersion.major < 6 || (nodeVersion.major === 6 && nodeVersion.minor < 6)) {
  console.error(
    `${red('Error!')} ${pkg.title} requires at least version 6.6 of Node. Please upgrade!`
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

const flags = ParseCommandLineArgs();

const directory = flags.root;

process.env.ASSET_DIR = '/' + Math.random().toString(36).substr(2, 11);

let current = process.cwd();

if (directory) {
  current = path.resolve(process.cwd(), directory);
}

// Ignore MacOSx files
let ignoredFiles = ['.DS_Store', '._.DS_Store'];

if (flags.ignore && flags.ignore.length > 0) {
  ignoredFiles = ignoredFiles.concat(flags.ignore);
}

// Initialize utils functions
const fu = FunctionalUtils(flags, ignoredFiles);

const handler = coroutine(function * (req, res) {
  yield serverHandler(req, res, flags, current, fu);
});

HtmlPages.server = flags.unzipped ? micro(handler) : micro(compress(handler));
let port = flags.port;

detect(port).then(open => {
  let inUse = open !== port;

  if (inUse && flags.noPortScan === true) {
    console.error(
      red(
        'The port `' + port + '` is already in use.'
      )
    );

    process.exit(500);
  }

  if (inUse) {
    port = open;

    inUse = {
      old: flags.port,
      open
    };
  }

  HtmlPages.server.listen(
    port,
    coroutine(function * () {
      yield listening(HtmlPages.server, current, inUse, flags.noClipboard !== true, fu);
    })
  );

  if (flags.dryTest === true) {
    setTimeout(function () {
      process.emit('kill');
    }, 1000);
  }
});

module.exports = HtmlPages;
