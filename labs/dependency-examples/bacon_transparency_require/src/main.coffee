require.config
  paths:
    'jquery':       '../../../../assets/jquery.min'
    'bacon':        'lib/bacon.min'
    'transparency': 'lib/transparency.min'
  shim:
    bacon: exports: 'Bacon'

require ['jquery', 'transparency', 'app'], ($, Transparency, TodoApp) ->

  # Register Transparency as a jQuery plugin
  Transparency.register $

  $ -> new TodoApp(el: $('#todoapp'))
