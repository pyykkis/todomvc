(function() {

  require.config({
    paths: {
      'jquery': '../../../../assets/jquery.min',
      'backbone': 'lib/backbone-min',
      'backbone.eventstream': 'lib/backbone.eventstream',
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

  require(['jquery', 'transparency', 'backbone', 'lodash', 'app', 'backbone.eventstream'], function($, Transparency, Backbone, _, TodoApp) {
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
