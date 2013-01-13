define ['bacon'], (Bacon) ->
  class FooterController
    constructor: ({@el, @todoBus}) ->
      todos                 = @todoBus.toProperty().log()
      openTodos             = todos.map((ts) -> ts.filter (t) -> not t.completed)
      completedTodos        = todos.map((ts) -> ts.filter (t) -> t.completed)
      completedListNotEmpty = completedTodos.map((ts) -> ts.length > 0)


      # Side effects
      openTodos
        .map((ts) -> "<strong>#{ts.length}</strong> " + if ts.length == 1 then "item left" else "items left")
        .onValue @el.find('#todo-count'), 'html'

      completedListNotEmpty.onValue @el.find('#clear-completed'), 'toggle'
      completedTodos.onValue (completedTodos) =>
        @el.find('#clear-completed').text "Clear completed (#{completedTodos.length})"
