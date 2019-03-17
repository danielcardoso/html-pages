// // Packages
// const assert = require('assert');
// const request = require('supertest');
// const $ = require('cheerio');

// // Ours
// const serverCaller = require('./initServer');

// let server;
// let htmlPages;

// const getJsonFromHtml = (response) => {
//   const $body = $(response.text);

//   const srctext = $body.find('script').first().html().replace(/\n/g, ' ');
//   const re = /(.*Window._sharedData\s+?=?\s+?)(.*)(;\s+Window.assetDir.*)/;
//   const newtext = srctext.replace(re, '$2');

//   return JSON.parse(newtext);
// };

// const options = {
//   'host': 'localhost',
//   'port': 8888,
//   'root': 'example/',
//   'cache': 1000,
//   'log-level': 'debug',
//   'silent': false,
//   'verbose': false,
//   'localhost': true,
//   'no-cache': false,
//   'no-port-scan': false,
//   'cors': false,
//   'directory-index': false,
//   'open': false,
//   'no-listing': false,
//   'notifications': false,
//   'browser': false,
//   'layout': false,
//   'auth': false,
//   'unzipped': false,
//   'no-clipboard': false,
//   'ignore': false,
//   'help': false,
//   'version': false
// };

// describe.only('options tests', function () {
//   this.timeout(5000);

//   beforeEach(function () {
//   });

//   afterEach(function () {
//     htmlPages.stop();
//   });

//   after(function () {
//     htmlPages.stop();
//   });

//   // should use default values
//   it('should validate if all options were changed', function (done) {
//     server = serverCaller.startServer({
//       'ignore': [],
//       'directory-index': 'false'
//     });
//     htmlPages = server.htmlPages;

//     console.log('options', htmlPages.options);

//     console.log('stdout', htmlPages.cli.stdout);

//     // done();

//     // request(server.httpHost)
//     //   .get('/')
//     //   .expect(200)
//     //   .then(response => {
//     //     serverCaller.parseResponse(response);
//     //     assert(htmlPages.cli.exitCode === null, 'Server is not running!');
//     //
//     //     // console.log('response', response.text);
//     //     // console.log('JS', $body.find('script').first().html());
//     //
//     //     const json = getJsonFromHtml(response);
//     //     assert(json.files.length === 2, 'Number of visible files is wrong!');
//     //
//     //     done();
//     //   });
//   });
// });
