// Native
const path = require('path');

// Packages
const fs = require('fs-extra');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const chalk = require('chalk');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');

// Ours
const pkg = require('../package');

module.exports = () => {
  const argsOptsFilePath = path.normalize(
    path.join(__dirname, '/../json/args.json')
  );
  const jsonArgs = fs.readJsonSync(argsOptsFilePath);

  const convertIgnoreArgsToArray = (obj) => {
    if (!_.isUndefined(obj.ignore)) {
      if (_.isString(obj.ignore)) {
        obj.ignore = obj.ignore.split(',');
      } else if (!_.isArray(obj.ignore)) {
        obj.ignore = [];
      }
    } else {
      obj.ignore = [];
    }
    return obj;
  };

  if (!_.isObject(jsonArgs.options)) {
    console.error(`${chalk.red('Error!')} Arguments file is not available!`);
    process.exit(1);
  }

  let optionsDefault = {};
  let optionsUserHome = {};
  let optionsArgs = {};

  const optionDefinitions = _.chain(jsonArgs.options)
    .sortBy(arg => {
      return arg.name.toLowerCase();
    })
    .map(arg => {
      let option = {};

      option.name = arg.name;
      if (_.isString(arg.alias)) {
        option.alias = arg.alias;
      }

      option.description = arg.description;
      option.show = arg.show !== false;
      arg.type = _.isString(arg.type) ? arg.type : 'String';
      // eslint-disable-next-line no-eval
      option.type = eval(arg.type);
      option.typeLabel = _.isString(arg.typeLabel) ? arg.typeLabel : arg.type.toLowerCase();
      option.typeLabel = option.typeLabel !== 'boolean' ? chalk.italic.dim(' <' + option.typeLabel + '> ') : '';

      if (_.isBoolean(arg.defaultOption) && arg.defaultOption === true) {
        option.defaultOption = true;
      }
      if (_.isBoolean(arg.multiple) && arg.multiple === true) {
        option.multiple = true;
      }
      if (!_.isUndefined(arg.defaultValue)) {
        option.defaultValue = arg.defaultValue;
        option.description += ' (defaults to ' + option.defaultValue + ')';
      }

      optionsDefault[option.name] = _.isUndefined(option.defaultValue) ? false : option.defaultValue;

      return option;
    })
    .value();

  const userHomeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  const userConfigPath = path.join(userHomeDir, '.html-pages.json');

  if (fs.existsSync(userConfigPath)) {
    try {
      optionsUserHome = fs.readJsonSync(userConfigPath);
    } catch (err) {
      console.error(
        `${chalk.red('Error!')} ${err}`
      );
      process.exit(1);
    }

    if (!_.isObject(optionsUserHome)) {
      console.error(
        `${chalk.red('Error!')} The ~/.html-pages.json is defined but the content isn't an object. Please check it!`
      );
      process.exit(1);
    }
  }

  _.each(commandLineArgs(optionDefinitions, {
    partial: true
  }), function (item, key) {
    if (!_.isUndefined(optionsDefault[key]) && optionsDefault[key] !== item) {
      optionsArgs[key] = item;
    }

    if (key === '_unknown') {
      optionsArgs[key] = item;
    }
  });

  if (_.isUndefined(optionsArgs._unknown)) {
    optionsArgs._unknown = [];
  }
  if (_.isArray(optionsArgs.root) && _.size(optionsArgs.root) !== 0) {
    _.merge(optionsArgs._unknown, _.slice(optionsArgs.root, 1));
    optionsArgs.root = _.first(optionsArgs.root);
  }

  if (_.size(optionsArgs._unknown) !== 0) {
    console.error(
      chalk.red('Ups!') + ' The option "' + _.first(optionsArgs._unknown) + '" is unknown. Here\'s a list of all available options:'
    );

    // Display help section
    optionsArgs.help = true;
  }

  // Delete unknown options
  delete optionsArgs._unknown;

  optionsDefault = camelcaseKeys(convertIgnoreArgsToArray(optionsDefault));
  optionsUserHome = camelcaseKeys(convertIgnoreArgsToArray(optionsUserHome));
  optionsArgs = camelcaseKeys(convertIgnoreArgsToArray(optionsArgs));
  const options = _.merge({}, optionsDefault, optionsUserHome, optionsArgs);

  // Merge ignore arrays
  options.ignore = [].concat(optionsDefault.ignore, optionsUserHome.ignore, optionsArgs.ignore);
  const appWorker = chalk.yellow.bold(pkg.name);

  // Validate options
  if (_.includes(['false', ''], options.directoryIndex.toLowerCase())) {
    options.directoryIndex = '';
  }
  if (options.cache === 0) {
    options.noCache = true;
  } else if (options.noCache === true) {
    options.cache = 0;
  }

  // Don't log anything to the console if silent mode is enabled otherside if verbose
  // is set will show every log
  if (options.silent) {
    options.noNotifications = true;
    options.logLevel = 'silent';
    options.verbose = false;
    console.log = () => {};
  } else if (options.verbose) {
    options.logLevel = 'debug';
    options.silent = false;
  }

  options.logLevel = _.toLower(options.logLevel);

  // If the user set a browser it will always open it
  if (options.browser !== false) {
    options.open = true;
  }

  // If the app is running a test
  if (options.dryTest) {
    options.open = false;
    options.noNotifications = true;
  }

  // Shows the helper menu
  if (options.help) {
    const usage = commandLineUsage([{
      header: chalk.yellow(pkg.title),
      content: chalk.dim(pkg.description)
    }, {
      header: chalk.yellow('Synopsis'),
      content: 'Usage: ' + appWorker + chalk.dim(' <path> [options] [command]')
    }, {
      header: chalk.yellow('Options'),
      optionList: _.filter(optionDefinitions, arg => {
        return arg.show === true;
      })
    }, {
      header: chalk.yellow('Examples'),
      content: [{
        desc: '$ ' + appWorker + chalk.dim(' --port 1904'),
        example: '1. Start using another port.'
      }, {
        desc: '$ ' + appWorker + chalk.dim(' --directory-index=""'),
        example: '2. Disable the directory index file. It will always show the directory listings.'
      }, {
        desc: '$ ' + appWorker + chalk.dim(' --open'),
        example: '3. Launch default browser.'
      }, {
        desc: '$ ' + appWorker + chalk.dim(' --browser="chrome"'),
        example: '4. Use Google Chrome instead of default browser.'
      }, {
        desc: '$ ' + appWorker + chalk.dim(' --no-listing --no-cache'),
        example: '5. Hide the directory structure and disable cache.'
      }]
    }, {
      content: 'Project home: ' + chalk.yellow.underline(pkg.homepage) + ''
    }]);
    console.info(usage);
    process.exit(0);
  }

  // Shows the application version
  if (options.version) {
    console.info(pkg.version);
    process.exit(0);
  }

  return options;
};
