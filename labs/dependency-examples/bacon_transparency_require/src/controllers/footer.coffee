define ['bacon'], (Bacon) ->
  class FooterController
    constructor: ({@el, @todoBus}) ->
      todos                 = @todoBus.toProperty()
      openTodos             = todos.map((ts) -> ts.filter (t) -> !t.completed).log()
      completedTodos        = todos.map((ts) -> ts.filter (t) -> t.completed)
      completedListNotEmpty = completedTodos.map((ts) -> ts.length > 0)

      #### Side effects

      # Clear completed todos
      @el.find('#clear-completed')
        .asEventStream('click')
        .map(openTodos)
        .onValue @todoBus, 'push'

      # Show open todos count
      openTodos
        .map((ts) -> "<strong>#{ts.length}</strong> " + if ts.length == 1 then "item left" else "items left")
        .onValue @el.find('#todo-count'), 'html'

      # Show completed todos count
      completedListNotEmpty.onValue @el.find('#clear-completed'), 'toggle'
      completedTodos.onValue (completedTodos) =>
        @el.find('#clear-completed').text "Clear completed (#{completedTodos.length})"
