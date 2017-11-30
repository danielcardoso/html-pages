const path = require('path');

const assert = require('assert');
const exec = require('child_process').execFile;

// Ours
const pkg = require('../package');

const cmd = path.join(__dirname, '..', 'bin', 'index.js');

function executeTest (args, callback) {
  args.push('--dry-test');

  if (process.platform === 'win32') {
    exec(process.execPath, [cmd].concat(args), callback);
  } else {
    exec(cmd, args, callback);
  }
}

describe('command line usage', function () {
  this.timeout(5000);

  before(function () {
  });

  after(function () {
  });

  it('vanilla start', done => {
    executeTest([], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('HTML Pages is Online!') !== -1, 'Title not found');
      assert(stdout.indexOf('Server is ready!') !== -1, 'Server is not ready!');
      assert(stdout.indexOf('html-pages stopped') !== -1, 'Stop message not found');
      done();
    });
  });

  it('--version', done => {
    executeTest(['--version'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf(pkg.version) === 0, 'version not found');
      done();
    });
  });

  it('-v', done => {
    executeTest(['-v'], (error, stdout, stdin) => {
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

  it('-h', done => {
    executeTest(['-h'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('Usage: ' + pkg.name) !== -1, 'usage helper not found');
      done();
    });
  });

  it('--localhost', done => {
    executeTest(['--localhost', '--port=8888'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('Server is ready!') !== -1, 'Server is not ready!');
      assert(stdout.indexOf('http://localhost:8888') !== -1, 'Localhost not found');
      done();
    });
  });

  it('--port', done => {
    executeTest(['--port=14123', '--localhost'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('Server is ready!') !== -1, 'Server is not ready!');
      assert(stdout.indexOf('HTML Pages is Online!') !== -1, 'serving string not found');
      assert(stdout.indexOf('http://localhost:14123') !== -1, 'port string not found');
      done();
    });
  });
  // it.only('-p', done => {
  //   executeTest(['-p 14124', '--localhost'], (error, stdout, stdin) => {
  //     assert(!error, error);
  //     assert(stdout.indexOf('Server is ready!') !== -1, 'Server is not ready!');
  //     assert(stdout.indexOf('HTML Pages is Online!') !== -1, 'serving string not found');
  //     assert(stdout.indexOf('http://localhost:14124') !== -1, 'port string not found');
  //     done();
  //   });
  // });

  it('--verbose', done => {
    executeTest(['--verbose'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('Server is ready!') !== -1, 'Server is not ready!');
      assert(stdout.indexOf('Options List:') !== -1, 'List of options title not found');
      assert(stdout.indexOf('Option: `verbose` set to `true`') !== -1, '`verbose` options is not defined as `true`');
      assert(stdout.indexOf('Option: `silent` set to `false`') !== -1, '`silent` options is not defined as `false`');
      assert(stdout.indexOf('Option: `log-level` set to `debug`') !== -1, '`log-level` options is not defined as `debug`');
      done();
    });
  });

  it('-V', done => {
    executeTest(['-V'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout.indexOf('Server is ready!') !== -1, 'Server is not ready!');
      assert(stdout.indexOf('Options List:') !== -1, 'List of options title not found');
      assert(stdout.indexOf('Option: `verbose` set to `true`') !== -1, '`verbose` options is not defined as `true`');
      assert(stdout.indexOf('Option: `silent` set to `false`') !== -1, '`silent` options is not defined as `false`');
      assert(stdout.indexOf('Option: `log-level` set to `debug`') !== -1, '`log-level` options is not defined as `debug`');
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

  it('-S', done => {
    executeTest(['-S'], (error, stdout, stdin) => {
      assert(!error, error);
      assert(stdout === '', 'stdout not empty');
      done();
    });
  });
});
