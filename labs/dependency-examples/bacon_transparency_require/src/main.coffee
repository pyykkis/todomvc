require.config
  paths:
    'jquery':               '../../../../assets/jquery.min'
    'backbone':             'lib/backbone-min'
    'backbone.eventstream': 'lib/backbone.eventstream'
    'lodash':               'lib/lodash.min'
    'bacon':                'lib/bacon.min'
    'transparency':         'lib/transparency.min'
  shim:
    bacon:
      deps: ['jquery']
      exports: 'Bacon'
    backbone:
      deps: ['lodash']
      exports: 'Backbone'
    lodash: exports: '_'

require ['jquery', 'transparency', 'backbone', 'lodash', 'app', 'backbone.eventstream'], ($, Transparency, Backbone, _, TodoApp) ->

    # Extend Backbone Models and Collections to act as a Bacon EventStreams
    _.extend Backbone.Model.prototype,      Backbone.EventStream
    _.extend Backbone.Collection.prototype, Backbone.EventStream

    # Register Transparency as a jQuery plugin
    Transparency.register $

    $ -> new TodoApp(el: $('#todoapp'))
