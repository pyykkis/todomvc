(function() {

  require.config({
    paths: {
      'jquery': '../../../../assets/jquery.min',
      'backbone': 'lib/backbone-min',
      'lodash': 'lib/lodash.min',
      'bacon': 'lib/bacon.min',
      'transparency': 'lib/transparency.min'
    },
    shim: {
      bacon: {
        deps: ['jquery'],
        exports: 'Bacon'
      },
      backbone: {
        deps: ['lodash'],
        exports: 'Backbone'
      },
      lodash: {
        exports: '_'
      }
    }
  });

  require(['jquery', 'transparency', 'app'], function($, Transparency, TodoApp) {
    Transparency.register($);
    return $(function() {
      return new TodoApp({
        el: $('#todoapp')
      });
    });
  });

}).call(this);
