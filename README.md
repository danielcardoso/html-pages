<p align="center">
  <a align="center" href="https://www.npmjs.com/package/html-pages">
    <img align="center" src="https://raw.githubusercontent.com/danielcardoso/art/master/html-pages/logo-512.png" width="220">
  </a>

  <h1 align="center" style="text-align: center;">HTML Pages</h1>

  <p align="center">
    Simple development http server for file serving and directory listing made by a Designer. Use it for hacking your HTML/JavaScript/CSS files, but not for deploying your final site.
    <br>
    <a href="https://www.npmjs.com/package/html-pages"><strong>Visit HTML Pages &raquo;</strong></a>
  </p>
</p>
<br/>

<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/danielcardoso/art/master/html-pages/listing.png" width="90%">
</p>
<br/>
<hr/>
<br/>


## Table of contents
- [Status](#status)
- [Quick start](#quick-start)
- [Usage from command line](#usage-from-command-line)
- [What next?](#what-next)
- [Version history](#version-history)
- [Author](#author)


## Status

[![npm version](https://img.shields.io/npm/v/html-pages.svg?style=flat-square)](https://www.npmjs.com/package/html-pages)
[![npm module downloads per month](http://img.shields.io/npm/dm/html-pages.svg?style=flat-square)](https://www.npmjs.org/package/html-pages)
[![node](https://img.shields.io/node/v/html-pages.svg?style=flat-square)](https://www.npmjs.com/package/micro-stats)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![Linux and Mac Build Status](https://img.shields.io/travis/danielcardoso/html-pages/master.svg?style=flat-square&label=Linux%20%26%20Mac%20Build)](https://travis-ci.org/danielcardoso/html-pages)
[![Windows Build Status](https://img.shields.io/appveyor/ci/danielcardoso/html-pages/master.svg?style=flat-square&label=Windows%20Build)](https://ci.appveyor.com/project/danielcardoso/html-pages)
[![dependency Status](https://img.shields.io/david/danielcardoso/html-pages.svg?style=flat-square)](https://david-dm.org/danielcardoso/html-pages)
[![devDependency Status](https://img.shields.io/david/dev/danielcardoso/html-pages.svg?style=flat-square)](https://david-dm.org/danielcardoso/html-pages?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/npm/name/badge.svg?style=flat-square)](https://snyk.io/test/npm/html-pages)


## Quick start

Each of us already wanted to share a certain directory on our network by running just a command little command, Am I right? Then this module is exactly what you're looking for: It provides a beautiful interface for listing the directory's contents and switching into sub folders.

In addition, it's also awesome because it comes to serving static sites. If a directory contains an `index.html`, `html-pages` will automatically render it instead of serving directory contents, and will serve any `.html` file as a rendered page instead of file's content as plaintext.

Another huge reason to use this package is that AJAX requests don't work with the `file://` protocol due to security restrictions, i.e. you need a server if your site fetches content through JavaScript.

#### Installation

You need to have node.js (`>v.6.6.0`) and npm installed. You should probably install this globally.

**Npm way**
```bash
npm install -g html-pages
```

This will install `html-pages` globally so that it may be run from the command line.

**Manual way**
```bash
git clone https://github.com/danielcardoso/html-pages
cd html-pages
npm install # Local dependencies if you want to hack
npm install -g # Install globally
```


## Usage from command line

You just have to call the command `html-pages` in your project's directory. Alternatively you can add the path to be a command line parameter.

#### Command line parameters

Run this command to see a list of all available options:

```bash
html-pages --help
```

###### Options

* `-a, --auth`                     —  Enables http-auth using the `PAGES_USER` and `PAGES_PASSWORD` environment variables
* `-b, --browser`  *string*        —  Specify browser to use instead of system default
* `-c, --cache`  *number*          —  Time in milliseconds for caching files in the browser (defaults to 3600)
* `-C, --cors`                     —  Setup CORS headers to allow requests from any origin
* `-d, --directory-index`  *file*  —  The index file of a directory. Set to empty `""` to always show the directory listing (defaults to index.html)
* `-h, --help`                     —  Output usage information
* `-i, --ignore`  *string/array*   —  Files and directories to ignore. Use a string (comma-separated string for paths to ignore) if your are using the command line and an array if you are calling it via API
* `-L, --layout`  *string*         —  Specify the page layout. Available options `grid` or `list`. (defaults to
                                   grid)
* `-l, --log-level`  *string*      —  Display logs in the console. The possible values are `silent`, `error`, `warn`, `info`, `debug`. Any logs of a higher level than the setting are shown. If you define it as `info`, it will show `warn` and `error` outputs also. (defaults to `info`)
  * `silent` - It will suppress all application logging. The Fatal errors will be shown.
  * `error` - Any error which is fatal to the operation, but not the service or application (can't open a required file, missing data, etc.). These errors will force user (administrator, or direct user) intervention. These are usually reserved (in my apps) for incorrect connection strings, missing services, etc.
  * `warn` - Anything that can potentially cause application oddities, but for which I am automatically recovering. (Such as switching from a primary to backup server, retrying an operation, missing secondary data, etc.)
  * `info` - Generally useful information to log (service start/stop, configuration assumptions, etc). Info I want to always have available but usually don't care about under normal circumstances. This is my out-of-the-box config level.
  * `debug` - Information that is diagnostically helpful to people more than just developers (IT, sysadmins, etc.).
* `-o, --open`                     —  Open browser window after starting the server
* `--no-cache`                     —  Disabled the caching files in the browser
* `--no-clipboard`                 —  Don't copy address to clipboard
* `--no-listing`                   —  Turn off the directory listings
* `--no-notifications`             —  Suppress automatic notifications launching
* `--no-port-scan`                 —  Disabled the port scanning when the selected port is already in use
* `-p, --port`  *number*           —  Port to listen on (defaults to 8084)
* `-r, --root`  *string*           —  The root directory (defaults to ./)
* `-S, --silent`                   —  Set `log-level` to `silent` mode
* `-u, --unzipped`                 —  Disable GZIP compression
* `-V, --verbose`                  —  Set `log-level` to `debug` mode
* `-v, --version`                  —  Output the version number

Default options:

If a file `~/.html-pages.json` exists it will be loaded and used as default options for html-pages on the command line. See [Options](#options) for option names.


#### Authentication

If you set the `--auth` flag, this package will look for a username and password in the `PAGES_USER` and `PAGES_PASSWORD` environment variables.

As an example, this is how such a command could look like:

```bash
PAGES_USER=daniel PAGES_PASSWORD=1904 html-pages --auth
```


## Usage from node

You can also use the package inside your application. Just load it:

```js
const pages = require('html-pages')
```

And call it with flags (check [Command line parameters](#command-line-parameters) for the full list):

```js
const pagesServer = pages(__dirname, {
  port: 1904,
  'directory-index': '',
  'no-clipboard': true,
  ignore: ['.git', 'node_modules']
})
```

To stop the server just use the method:

```js
pagesServer.stop()
```

## What next?

* Enable HTTPS support;
* Add Proxy support;
* Provide a /robots.txt (whose content defaults to `'User-agent: *\nDisallow: /'`);
* Improve HTML errors;


## Version history

* v2.1.0
  - Security updates
* v2.0.0
  - Specify the page layout. Available options `grid` or `list`
  - Add `host` address to bind to. By default it supports "any address"
  - Add `localhost` option to work only locally, blocking external connections
  - Disable notification by default
  - Minor improvements
* v1.7.0
  - Logs all requests: add options `log-level`, `verbose` and `silent` to filter the logs
  - Minor improvements
* v1.6.0
  - Replace the option `--no-browser` with the `--open` or `-o`
  - Added some logging to console
  - Improve HTML errors
  - Minor improvements
* v1.5.0
  - Using Travis CI (Linux and Mac Build Status)
  - Using AppVeyor (Windows Build Status)
  - CORS support
  - Load initial settings from `~/.html-pages.json` if exists
  - Minor improvements
  - Improve tests
* v1.4.0
  - Update dependencies
* v1.3.0
  - Code Refactoring
* v1.2.0
  - Add web browser launching support:
    - it uses [opn](https://www.npmjs.com/package/opn) to allow opening links in different browsers;
  - Minor improvements
* v1.1.0
  - Add icons with the file types to the directory listing;
  - Add example files;
* v1.0.0
  - Initial release


## Author

Daniel Cardoso ([@DanielCardoso](https://twitter.com/DanielCardoso)) - [DanielCardoso.net](http://www.danielcardoso.net)
