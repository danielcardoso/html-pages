(function() {

  $.cookie.defaults = {
    // domain: 'example.com',
    expires: 365,
    path: '/',
  };

  var cookie = {
    options: {
      name: 'html-pages-layout'
    }
  };

  cookie.get = function () {
    return $.cookie(cookie.options.name);
  };

  cookie.set = function (value) {
    $.cookie(cookie.options.name, value);
  };


  var itemsFU = {};

  itemsFU.itemListTemplate = _.template('' +
    '<li class="resource-item resource-item--hover">' +
      '<a class="resource-item__content" href="/<%- item.relative %>" title="<%- item.title %>">' +
        '<div class="column-file-name">' +
          '<span class="file-icon">' +
            '<img class="file-type<% if (item.iconIsStructure) { %> file-type--structure<% } %>" src="<%- structure.assetDir %>/images/icons/<%- item.iconPath %>" alt="Icon [<%- item.ext %>]">' +
          '</span>' +
          '<%- item.base %>' +
        '</div>' +
        '<div class="column-file-last-created">' +
          '<div class="broken-words"><%- item.stats.birthtime %></div>' +
        '</div>' +
        '<div class="column-file-last-modified">' +
          '<div class="broken-words"><%- item.stats.date %></div>' +
        '</div>' +
        '<div class="column-file-size text-nowrap">' +
          '<div class="broken-words"><%- item.stats.size %></div>' +
        '</div>' +
      '</a>' +
    '</li>');

  itemsFU.itemGridTemplate = _.template('' +
    '<li class="resource-item resource-item--hover">' +
      '<a class="resource-item__content" href="/<%- item.relative %>" title="<%- item.title %>">' +
        '<div class="column-file-name">' +
            '<span class="file-icon">' +
              '<img class="file-type<% if (item.iconIsStructure) { %> file-type--structure<% } %>" src="<%- structure.assetDir %>/images/icons/<%- item.iconPath %>" alt="Icon [<%- item.ext %>]">' +
            '</span>' +
            '<%- item.base %>' +
        '</div>' +
        // '<div class="column-file-last-created">' +
        //   '<div class="broken-words"><%- item.stats.birthtime %></div>' +
        // '</div>' +
        // '<div class="column-file-last-modified">' +
        //   '<div class="broken-words"><%- item.stats.date %></div>' +
        // '</div>' +
        // '<div class="column-file-size text-nowrap">' +
        //   '<div class="broken-words"><%- item.stats.size %></div>' +
        // '</div>' +
      // '</div>' +
      '</a>' +
    '</li>');

  itemsFU.emptyItemTemplate = _.template('' +
    '<li class="resource-item resource-item--empty">' +
      '<div class="resource-item__content resource-item__content--empty">' +
        '<img width="128" height="128" alt="Empty Folder" src="<%- structure.assetDir %>/images/structure/empty-folder.svg">' +
        '<h4>This folder is empty!</h4>' +
      '</div>' +
    '</li>');

  itemsFU.globalTemplate = _.template('' +
    '<ul class="html-pages__resources-list">' +

      '<% if (Window.layoutType === \'grid\') { %>' + // Grid Style

        '<% if (_.size(files) > 0) { %>' +
          '<% if (_.isObject(parent)) { %>' +
            '<%= renderItemGridTemplate({item: parent, structure: structure}) %>' +
          '<% } %>' +
          '<% var type = "asdasd";%>' +
          '<% _.each(files, function(file) { %>' +
            '<% if (type !== file.type) { ' +
              'type = file.type; %>' +
              '<li class="resource-item resource-item--title">' +
                '<%- (type === "dir") ? "Folder" : "Files" %>' +
              '</li>' +
              '</ul><ul class="html-pages__resources-list">' +
            '<% } %>' +
            // '<%- console.log(type, file) %>' +
            '<%= renderItemGridTemplate({item: file, structure: structure}) %>' +
          '<% }); %>' +
        '<% } else { %>' +
          '<%= renderEmptyItemTemplate({structure: structure}) %>' +
        '<% } %>' +

      '<% } else { %>' + // List Style

        '<li class="header resource-item">' +
          '<div class="resource-item__content">' +
            '<div class="column-file-name">' +
              'Name' +
            '</div>' +
            '<div class="column-file-last-created">' +
              'Created time' +
            '</div>' +
            '<div class="column-file-last-modified">' +
              'Modified time' +
            '</div>' +
            '<div class="column-file-size text-nowrap">' +
              'File Size' +
            '</div>' +
          '</div>' +
        '</li>' +
        '<% if (_.isObject(parent)) { %>' +
          '<%= renderItemListTemplate({item: parent, structure: structure}) %>' +
        '<% } %>' +
        '<% if (_.size(files) > 0) { %>' +
          '<% _.each(files, function(file) { %>' +
            // '<%- console.log(file) %>' +
            '<%= renderItemListTemplate({item: file, structure: structure}) %>' +
          '<% }); %>' +
        '<% } else { %>' +
          '<%= renderEmptyItemTemplate({structure: structure}) %>' +
        '<% } %>' +
      '<% } %>' +
    '</ul>' +
    '');

  itemsFU.render = function () {
    var $elem, json, assetDir;
    $elem = $('#html-pages');
    json = Window._sharedData || {};
    assetDir = Window.assetDir || {};
    // var layoutType = _.isString(Window.layoutType) && Window.layoutType === 'list' ? 'list' : 'grid';

    json.renderItemListTemplate = itemsFU.itemListTemplate;
    json.renderItemGridTemplate = itemsFU.itemGridTemplate;
    json.renderEmptyItemTemplate = itemsFU.emptyItemTemplate;

    json.structure = {assetDir: assetDir};

    $elem
      .css('padding-top', $('header').outerHeight() + 6)
      .html(itemsFU.globalTemplate(json));

    $('.js-loader').hide();
  };

  var container, optionSwitch;
  container = document.getElementById('html-pages');
  optionSwitch = Array.prototype.slice.call(document.querySelectorAll('.html-pages-options button'));

  function init () {
    optionSwitch.forEach(function (el) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        _switch(this);
      }, false);
    });

    checkLayoutType();

    itemsFU.render();
  }

  function _switch (opt) {
    $('.js-loader').show();

    // remove other view classes and any any selected option
    optionSwitch.forEach(function (el) {
      $(container).removeClass(el.getAttribute('data-layout'));
      $(el).removeClass('html-pages-option--selected');
    });
    // add the view class for this option
    Window.layoutType = opt.getAttribute('data-layout');
    // this option stays selected
    // $(opt).addClass('html-pages-option--selected');

    checkLayoutType();

    itemsFU.render();
  }

  function checkLayoutType () {
    Window.layoutType = (Window.layoutType === 'list' ? 'list' : 'grid');

    cookie.set(Window.layoutType);

    $('#html-pages')
      .empty()
      .removeClass('html-pages-view--list html-pages-view--grid')
      .addClass('html-pages-view--' + Window.layoutType);

    $('.html-pages-options .html-pages-option--selected').removeClass('html-pages-option--selected');
    $('.html-pages-options [data-layout="' + Window.layoutType + '"]')
      .addClass('html-pages-option--selected');
  }

  if (Window._sharedData.layout === false) {
    Window.layoutType = cookie.get();
  } else {
    Window.layoutType = Window._sharedData.layout;
    cookie.set(Window.layoutType);
  }

  init();

  $(window).scroll(function() {
    var windowpos = $(window).scrollTop();

    if (windowpos > 10) {
      $('header').addClass("stick");
    } else {
      $('header').removeClass("stick");
    }
  });
})();
