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
[![dependency Status](https://img.shields.io/david/danielcardoso/html-pages.svg?style=flat-square)](https://david-dm.org/danielcardoso/html-pages)
[![devDependency Status](https://img.shields.io/david/dev/danielcardoso/html-pages.svg?style=flat-square)](https://david-dm.org/danielcardoso/html-pages?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)


## Quick start

Each of us already wanted to share a certain directory on our network by running just a command little command, Am I right? Then this module is exactly what you're looking for: It provides a beautiful interface for listing the directory's contents and switching into sub folders.

In addition, it's also awesome because it comes to serving static sites. If a directory contains an `index.html`, `html-pages` will automatically render it instead of serving directory contents, and will serve any `.html` file as a rendered page instead of file's content as plaintext.

Another huge reason to use this package is that AJAX requests don't work with the `file://` protocol due to security restrictions, i.e. you need a server if your site fetches content through JavaScript.

#### Installation:

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

#### Command line parameters:

Run this command to see a list of all available options:

```bash
html-pages help
```

* `--auth` —                   Enables http-auth using the `PAGES_USER` and `PAGES_PASSWORD` environment variables (disabled by default)
* `--cache=SECONDS` —          Time in milliseconds for caching files in the browser (defaults to 3600)
* `--cors` —                   Setup CORS headers to allow requests from any origin (disabled by default)
* `--directoryIndex=FILENAME` — The index file of a directory. Set to false to always show the directory listing. (defaults to "index.html")
* `--ignore=PATH` —            Comma-separated string of paths to ignore ([ignore](https://github.com/es128/anymatch) is a manager and filter which implemented in pure JavaScript according to the .gitignore spec)
* `--noCache` —                Disabled the caching files in the browser (disabled by default)
* `--noClipboard` —            Don't copy address to clipboard (disabled by default)
* `--noListing` —              Turn off the directory listings. (disabled by default)
* `--port=NUMBER` —            Port to listen on (defaults to 8084)
* `--silent` —                 Don't log anything to the console (disabled by default)
* `--unzipped` —               Disable GZIP compression (disabled by default)
* `--help | -h` —              Output usage information
* `--version | -v` —           Output the version number


#### Authentication

If you set the `--auth` flag, this package will look for a username and password in the `PAGES_USER` and `PAGES_PASSWORD` environment variables.

As an example, this is how such a command could look like:

```bash
PAGES_USER=daniel PAGES_PASSWORD=1904 html-pages --auth
```


## What next?

* Add tests to package;
* Display logs;
* Enable HTTPS support;
* Add web browser launching (use [opn](https://www.npmjs.com/package/opn) to allow opening more than one link in different browsers);
* Add Proxy support;
* Add Notifications ([node-notifier](https://www.npmjs.com/package/node-notifier));
* Provide a /robots.txt (whose content defaults to `'User-agent: *\nDisallow: /'`);
* Add default options file;
* Improve HTML errors;


## Version history

* v1.1.0
  - Add icons with the file types to the directory listing;
  - Add example files;
* v1.0.0
  - Initial release


## Author

Daniel Cardoso ([@DanielCardoso](https://twitter.com/DanielCardoso)) - [DanielCardoso.net](http://www.danielcardoso.net)
