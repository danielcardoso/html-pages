// Packages
const assert = require('assert');
const request = require('supertest');
const $ = require('cheerio');

// Ours
const serverCaller = require('./initServer');

let server;
let htmlPages;

const getJsonFromHtml = (response) => {
  const $body = $(response.text);

  const srctext = $body.find('script').first().html().replace(/\n/g, ' ');
  const re = /(.*Window._sharedData\s+?=?\s+?)(.*)(;\s+Window.assetDir.*)/;
  const newtext = srctext.replace(re, '$2');

  return JSON.parse(newtext);
};

describe('ignore files tests', function () {
  this.timeout(5000);

  beforeEach(function () {
  });

  afterEach(function () {
    htmlPages.stop();
  });

  after(function () {
    htmlPages.stop();
  });

  it('should respond with all folders and pages', function (done) {
    server = serverCaller.startServer({
      ignore: [],
      'directory-index': 'false'
    });
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/')
      .expect(200)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');

        // console.log('response', response.text);
        // console.log('JS', $body.find('script').first().html());

        const json = getJsonFromHtml(response);
        assert(json.files.length === 2, 'Number of visible files is wrong!');

        done();
      });
  });

  it('should respond without html files', function (done) {
    server = serverCaller.startServer({
      ignore: ['*.html'],
      'directory-index': 'false'
    });
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/')
      .expect(200)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');

        const json = getJsonFromHtml(response);
        assert(json.files.length === 1, 'Number of visible files is wrong!');

        done();
      });
  });

  it('should respond without files', function (done) {
    server = serverCaller.startServer({
      ignore: ['*'],
      'directory-index': 'false'
    });
    htmlPages = server.htmlPages;

    request(server.httpHost)
      .get('/')
      .expect(200)
      .then(response => {
        serverCaller.parseResponse(response);
        assert(htmlPages.cli.exitCode === null, 'Server is not running!');

        const json = getJsonFromHtml(response);
        assert(json.files.length === 0, 'Number of visible files is wrong!');

        done();
      });
  });
});
