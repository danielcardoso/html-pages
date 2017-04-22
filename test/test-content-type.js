// Native
const path = require('path');

// Packages
const assert = require('assert');
const request = require('supertest');
const fs = require('fs-promise');
const mime = require('mime-types');

// Ours
const serverCaller = require('./initServer');
let server;
let htmlPages;

const webDir = path.resolve(__dirname, '..', 'example', 'All-Extensions');
const filesList = fs.readdirSync(webDir);

describe('content-type tests', function () {
  this.timeout(1000);

  before(function () {
    this.timeout(4000);
    server = serverCaller.startServer({}, webDir);
    htmlPages = server.htmlPages;
  });

  after(function () {
    htmlPages.stop();
  });

  for (const index in filesList) {
    const fileName = filesList[index];
    const lookup = mime.lookup(fileName);

    if (lookup !== false) {
      it('should respond with appropriate `' + lookup + '` content-type for file ' + fileName, function (done) {
        request(server.httpHost)
          .get('/' + fileName)
          .expect(200)
          .then(response => {
            serverCaller.parseResponse(response);
            assert(response.headers['content-type'].indexOf(lookup) > -1,
              'Wrong Content-Type option: ' + response.headers['content-type']);
            assert(htmlPages.cli.exitCode === null, 'Server is not running!');
            done();
          });
      });
    }
  }
});
