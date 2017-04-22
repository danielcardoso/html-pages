const path = require('path');

const assert = require('assert');
const exec = require('child_process').execFile;

// Ours
const pkg = require('../package');

const cmd = path.join(__dirname, '..', 'bin', 'index.js');

function executeTest (args, callback) {
  args.push('--no-browser');
  args.push('--no-clipboard');
  args.push('--dry-test');

  if (process.platform === 'win32') {
    exec(process.execPath, [cmd].concat(args), callback);
  } else {
    exec(cmd, args, callback);
  }
}

describe('command line usage', function () {
  this.timeout(3500);

  before(function () {
  });

  after(function () {
  });

  it('--version', done => {
    executeTest(['--version'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf(pkg.version) === 0, 'version not found');
      done();
    });
  });
  it('--help', done => {
    executeTest(['--help'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('Usage: ' + pkg.name) !== -1, 'usage helper not found');
      done();
    });
  });
  it('--port', done => {
    executeTest(['--port=14123'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('HTML Pages is Online!') !== -1, 'serving string not found');
      assert(stdout.indexOf('http://localhost:14123') !== -1, 'port string not found');
      done();
    });
  });
  it('--silent', done => {
    executeTest(['--silent'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout === '', 'stdout not empty');
      done();
    });
  });
});
