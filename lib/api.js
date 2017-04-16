// Native
const path = require('path');
const { spawn } = require('child_process');

// Packages
const dargs = require('dargs');

module.exports = (directory = process.cwd(), options = {}) => {
  const scriptPath = path.join(__dirname, '..', 'bin', 'index.js');
  const aliases = { cors: 'o' };

  options._ = [directory]; // Let dargs handle the directory argument

  // The CLI only understands comma-separated values for ignored files
  // So we join the string array with commas
  if (options.ignore) {
    options.ignore = options.ignore.join(',');
  }

  const args = [scriptPath, ...dargs(options, { aliases })];

  const cli = spawn('node', args, {
    stdio: 'inherit'
  });

  return {
    stop () {
      cli.kill();
    }
  };
};
