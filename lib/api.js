// Native
const path = require('path');
const { spawn } = require('child_process');

// Packages
const dargs = require('dargs');

module.exports = (directory = process.cwd(), options = {}) => {
  const scriptPath = path.join(__dirname, '..', 'bin', 'index.js');
  const aliases = {};

  options.root = [directory]; // Let dargs handle the directory argument

  const args = [scriptPath, ...dargs(options, { aliases })];

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
