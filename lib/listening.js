// Native
const { basename } = require('path');

// Packages
const { write: copy } = require('clipboardy');
const ip = require('ip');
const pathType = require('path-type');
const chalk = require('chalk');
const boxen = require('boxen');
const { coroutine } = require('bluebird');

// Ours
const pkg = require('../package');

module.exports = coroutine(function * (server, current, inUse, clipboard, utils) {
  const details = server.address();
  const isTTY = process.stdout.isTTY;

  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });

  let isDir;

  try {
    isDir = yield pathType.dir(current);
  } catch (err) {
    isDir = false;
  }

  if (!isDir) {
    const base = basename(current);

    console.error(
      chalk.red(`Specified directory ${chalk.bold(`"${base}"`)} doesn't exist!`)
    );

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  if (process.env.NODE_ENV !== 'production') {
    let message = chalk.green(pkg.title + ' is Online!');
    let copiedUrl;

    if (inUse) {
      message += ' ' +
        chalk.red(
          `(on port ${inUse.open}, because ${inUse.old} is already in use)`
        );
    }

    message += '\n\n';
    const localURL = `http://localhost:${details.port}`;
    copiedUrl = localURL;
    message += `- ${chalk.bold('Local Network:   ')} ${localURL}`;

    try {
      const ipAddress = ip.address();
      const url = `http://${ipAddress}:${details.port}`;
      copiedUrl = url;

      message += `\n- ${chalk.bold('On Your Network: ')} ${url}`;
    } catch (err) {}

    if (isTTY && clipboard) {
      try {
        yield copy(copiedUrl);
        message += `\n\n${chalk.grey('Copied the address to clipboard :)')}`;
      } catch (err) {}
    }

    utils.openInBrowser(copiedUrl);

    console.log(
      boxen(message, {
        padding: {
          top: 2,
          right: 6,
          bottom: 2,
          left: 6
        },
        dimBorder: true,
        borderColor: 'gray',
        borderStyle: 'double',
        margin: 1
      })
    );
  }
});
