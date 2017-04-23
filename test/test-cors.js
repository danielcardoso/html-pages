// Packages
const assert = require('assert');
const request = require('supertest');

// Ours
const serverCaller = require('./initServer');
let server;
let htmlPages;

describe('cors tests', function () {
  this.timeout(4000);

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

  it('should respond with appropriate header', function (done) {
    server = serverCaller.startServer({cors: true});
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/index.html')
      .set('Origin', 'http://example.com')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect('Access-Control-Allow-Origin', 'http://example.com')
      .expect(/Hello world/i)
      .expect(200)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });
  it('should support preflighted requests', function (done) {
    server = serverCaller.startServer({cors: true});
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .options('/index.html')
      .set('Origin', 'http://example.com')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'X-PINGOTHER')
      .expect('Access-Control-Allow-Origin', 'http://example.com')
      .expect('Access-Control-Allow-Methods', /POST/)
      .expect('Access-Control-Allow-Headers', 'X-PINGOTHER')
      .expect(204)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });
  it('should support requests with credentials', function (done) {
    server = serverCaller.startServer({cors: true});
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .options('/index.html')
      .set('Origin', 'http://example.com')
      .set('Cookie', 'foo=bar')
      .expect('Access-Control-Allow-Origin', 'http://example.com')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(204)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');
        done();
      });
  });
});
