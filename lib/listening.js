// Native
const basename = require('path').basename;

// Packages
const { write: copy } = require('clipboardy');
const ip = require('ip');
const pathType = require('path-type');
const chalk = require('chalk');
const coroutine = require('bluebird').coroutine;

// Ours
const pkg = require('../package');
module.exports = coroutine(function * (server, current, inUse, clipboard, fu) {
  const details = server.address();
  const isTTY = process.stdout.isTTY;

  const stopServer = () => {
    server.close();
    global.utils.logger.log(chalk.red(pkg.name + ' stopped.'));
    process.exit(0);
  };

  process.on('SIGINT', () => {
    stopServer();
  });
  process.on('kill', () => {
    stopServer();
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
    process.exit(1);
  }

  let message = '\n' + chalk.blue(pkg.title + ' is Online!') + ' 🚀';
  let notificationTxt = 'The server is running.';

  const localURL = `http://localhost:${details.port}`;
  let copiedUrl = localURL;
  // message += `- ${chalk.bold('Local Network:   ')} ${localURL}`;

  if (!global.options.onlyLocalhost) {
    try {
      const ipAddress = ip.address();
      const url = `http://${ipAddress}:${details.port}`;
      copiedUrl = url;
    } catch (err) {}
  }

  message += '\nServing ' + chalk.green(current) + ' at ' + chalk.green(copiedUrl);
  if (inUse) {
    message += ' ' +
      chalk.red.italic(
        `(on port ${inUse.open}, because ${inUse.old} is already in use)`
      );
  }

  if (isTTY && clipboard) {
    try {
      yield copy(copiedUrl);
      message += `\n${chalk.grey('The address was copied to the clipboard :)')}`;
      notificationTxt += ' The address was copied to the clipboard :)';
    } catch (err) {}
  }

  fu.openInBrowser(copiedUrl);
  fu.notify(notificationTxt);

  global.utils.logger.log(message, true);

  global.utils.logger.log(chalk.green('\nServer is ready!\n'), true);
});
