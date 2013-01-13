(function() {

  require.config({
    paths: {
      'jquery': '../../../../assets/jquery.min',
      'bacon': 'lib/bacon.min',
      'transparency': 'lib/transparency.min'
    },
    shim: {
      bacon: {
        deps: ['jquery'],
        exports: 'Bacon'
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
