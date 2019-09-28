// Native
const path = require('path');

// Packages
const fs = require('fs-promise');
const Handlebars = require('handlebars');

module.exports = (page) => {
  const pageToLoad = page === undefined ? 'index' : page + '.hbs';
  let viewContent = false;
  const viewPath = path.normalize(path.join(__dirname, '/../views/' + pageToLoad + '.hbs'));

  viewContent = fs.readFileSync(viewPath, 'utf8');

  return Handlebars.compile(viewContent);
};
