define ['bacon'], (Bacon) ->

  class TodoApp
    constructor: ({@el}) ->
      # Elements
      @main   = @el.find '#main'
      @footer = @el.find '#footer'

      # Events and Properties
      todos     = new Bacon.Bus()
      showTodos = todos.map (todos) -> todos.length > 0

      # Side effects
      showTodos.onValue @main,   'toggle'
      showTodos.onValue @footer, 'toggle'

      # Kickstart
      todos.push []
