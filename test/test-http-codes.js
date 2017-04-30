// Packages
const assert = require('assert');
const request = require('supertest');

// Ours
const serverCaller = require('./initServer');
let server;
let htmlPages;

describe('http codes tests', function () {
  this.timeout(5000);

  beforeEach(function () {
    // mlog.log('Start test');
  });

  afterEach(function () {
    // mlog.log('End test\n');
    htmlPages.stop();
  });

  after(function () {
    // mlog.log('End off all tests\n');
    htmlPages.stop();
  });

  it('should respond with http code status 200', function (done) {
    server = serverCaller.startServer();
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/index.html')
      .expect(200)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });

  it('should respond with http code status 301', function (done) {
    server = serverCaller.startServer();
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/sub')
      .expect(301)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });

  it('should respond with http code status 401', function (done) {
    server = serverCaller.startServer({
      'auth': true
    });
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/')
      .expect(401)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });

  it('should respond with http code status 403', function (done) {
    server = serverCaller.startServer({
      'no-listing': true,
      'directory-index': 'false'
    });
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/')
      .expect(403)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });

  it('should respond with http code status 404', function (done) {
    server = serverCaller.startServer();
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/404.html')
      .expect(404)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });
});
