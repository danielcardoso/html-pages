// Native
const path = require('path');

// Packages
const pathType = require('path-type');
const filesize = require('filesize');
const fs = require('fs-promise');
const { coroutine } = require('bluebird');
const _ = require('underscore');
const moment = require('moment');

// Ours
const pkg = require('../package');
const prepareView = require('./view');
// Functions
const parseListItem = function (item, getIconFromFileName) {
  if (_.isUndefined(item)) {
    item = {};
  }
  if (!_.isObject(item.stats)) {
    item.stats = {};
  }

  if (_.isUndefined(item.stats.size)) {
    item.stats.size = '—';
  }
  if (_.isUndefined(item.stats.date)) {
    item.stats.date = '';
  }
  if (_.isUndefined(item.type)) {
    item.type = 'parent';
  }

  item.iconIsStructure = true;
  if (item.type === 'parent') {
    item.iconPath = 'structure/folder-parent.svg';
  } else if (item.type === 'dir') {
    item.iconPath = 'structure/folder.svg';
  } else {
    item.iconPath = 'icons/' +
      getIconFromFileName(item.base, item.ext) +
      '.png';
    item.iconIsStructure = false;
  }

  return item;
};

module.exports = coroutine(
  function * (port, current, dir, ignorePattern, getIconFromFileName) {
    let filesRaw = [];
    const subPath = path.relative(current, dir);

    if (!fs.existsSync(dir)) {
      return false;
    }

    try {
      filesRaw = yield fs.readdir(dir);
    } catch (err) {
      throw err;
    }

    let files = [];

    for (const file of filesRaw) {
      const filePath = path.resolve(dir, file);
      const details = path.parse(filePath);

      details.title = details.base;
      details.stats = {};

      if (yield pathType.dir(filePath)) {
        details.base += '/';
        details.type = 'dir';
        details.stats.size = '—';
      } else {
        details.ext = details.ext.split('.')[1] || '';
        details.type = 'file';
      }

      details.relative = path.join(subPath, details.base);

      if (ignorePattern.isValidPath(details.relative)) {
        let fileStats;

        try {
          fileStats = yield fs.stat(filePath);
        } catch (err) {
          throw err;
        }

        if (!_.isString(details.stats.size)) {
          details.stats.sizeRaw = fileStats.size;
          details.stats.size = filesize(fileStats.size, {
            round: 1,
            spacer: ' ',
            standard: 'jedec'
          });
        }

        details.stats.time = moment(fileStats.mtime).format('X');
        details.stats.date = moment(fileStats.mtime).format(
          'DD-MMM-YYYY HH:mm'
        );
        details.stats.birthtime = moment(fileStats.birthtime).format(
          'DD-MMM-YYYY HH:mm'
        );

        files.push(details);
      }
    }

    const directory = path.join(path.basename(current), subPath);
    const pathParts = directory.split(path.sep);

    let hasParent = false;
    if (dir.indexOf(current + '/') > -1) {
      const directoryPath = [...pathParts];

      // Remove first element
      directoryPath.shift();

      hasParent = parseListItem(
        {
          type: 'parent',
          base: 'Parent Directory',
          relative: path.join(...directoryPath, '..'),
          title: path.join(...pathParts.slice(0, -2), '/')
        },
        getIconFromFileName
      );
    }

    // Parse each file and update information
    files = _.chain(files)
      .filter(file => {
        return _.isObject(file);
      })
      .map(file => {
        return parseListItem(file, getIconFromFileName);
      })
      .sortBy(file => {
        return file.name.toLowerCase();
      })
      .sortBy(file => {
        // Always show directories first and than the files
        return file.type === 'dir' ? 2 : 3;
      })
      .value();

    const render = prepareView();
    const paths = [];

    for (const part in pathParts) {
      if (!{}.hasOwnProperty.call(pathParts, part)) {
        continue;
      }

      let before = 0;
      const parents = [];

      while (before <= part) {
        parents.push(pathParts[before]);
        before++;
      }

      parents.shift();

      paths.push({
        name: pathParts[part],
        url: parents.join('/')
      });
    }

    const details = {
      structure: {
        name: pkg.title,
        description: pkg.description,
        assetDir: process.env.ASSET_DIR,
        directory
      },
      author: {
        username: pkg.author.name,
        link: pkg.author.url
      },
      project: {
        parent: hasParent,
        files,
        paths
      }
    };

    return render(details);
  }
);
