require.config
  paths:
    'jquery':               '../../../../assets/jquery.min'
    'backbone':             'lib/backbone-min'
    'localstorage':         'lib/backbone.localStorage-min'
    'backbone.eventstream': 'lib/backbone.eventstream'
    'underscore':           'lib/underscore-min'
    'bacon':                'lib/bacon.min'
    'transparency':         'lib/transparency.min'
  shim:
    bacon:
      deps: ['jquery']
      exports: 'Bacon'
    backbone:
      deps: ['underscore']
      exports: 'Backbone'
    underscore: exports: '_'

require ['jquery', 'transparency', 'backbone', 'underscore', 'app', 'backbone.eventstream'],
  ($, Transparency, Backbone, _, TodoApp) ->

    # Extend Backbone Models and Collections to act as a Bacon EventStreams
    _.extend Backbone.Model.prototype,      Backbone.EventStream
    _.extend Backbone.Collection.prototype, Backbone.EventStream

    # Register Transparency as a jQuery plugin
    Transparency.register $

    $ -> new TodoApp(el: $('#todoapp'))
