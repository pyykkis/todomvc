(function() {

  require.config({
    paths: {
      'jquery': '../../../../assets/jquery.min',
      'backbone': 'lib/backbone-min',
      'localstorage': 'lib/backbone.localStorage-min',
      'backbone.eventstream': 'lib/backbone.eventstream',
      'underscore': 'lib/underscore-min',
      'bacon': 'lib/bacon.min',
      'transparency': 'lib/transparency.min'
    },
    shim: {
      bacon: {
        deps: ['jquery'],
        exports: 'Bacon'
      },
      backbone: {
        deps: ['underscore'],
        exports: 'Backbone'
      },
      underscore: {
        exports: '_'
      }
    }
  });

  require(['jquery', 'transparency', 'backbone', 'underscore', 'app', 'backbone.eventstream'], function($, Transparency, Backbone, _, TodoApp) {
    _.extend(Backbone.Model.prototype, Backbone.EventStream);
    _.extend(Backbone.Collection.prototype, Backbone.EventStream);
    Transparency.register($);
    return $(function() {
      return new TodoApp({
        el: $('#todoapp')
      });
    });
  });

}).call(this);
