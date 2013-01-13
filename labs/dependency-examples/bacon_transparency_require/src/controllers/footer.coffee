define ['bacon'], (Bacon) ->
  class FooterController
    constructor: ({@el, @todoBus}) ->
      todos                 = @todoBus.toProperty().log()
      openTodos             = todos.map((ts) -> ts.filter (t) -> not t.completed)
      completedTodos        = todos.map((ts) -> ts.filter (t) -> t.completed)
      completedListNotEmpty = completedTodos.map((ts) -> ts.length > 0)

      completedListNotEmpty.onValue @el.find('#clear-completed'), 'toggle'
      completedTodos.onValue (completedTodos) =>
        @el.find('#clear-completed').text "Clear completed (#{completedTodos.length})"
