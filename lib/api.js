// Native
const path = require('path');
const spawn = require('child_process').spawn;

// Packages
const dargs = require('dargs');

module.exports = (directory = process.cwd(), options = {}) => {
  const scriptPath = path.join(__dirname, '..', 'bin', 'index.js');
  const aliases = {};

  options.root = [directory];

  const args = [scriptPath, ...dargs(options, {
    aliases
  })];

  const cli = spawn('node', args, {
    stdio: 'inherit'
  });

  return {
    cli,
    stop () {
      cli.kill();
    },
    options
  };
};
