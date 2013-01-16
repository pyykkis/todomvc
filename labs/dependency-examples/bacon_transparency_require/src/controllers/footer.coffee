define ['bacon'], (Bacon) ->
  class FooterController

    $: (args...) -> @el.find args...

    constructor: ({@el, model}) ->

      # Properties
      modelChanges          = model.asEventStream("add remove reset change")
      todos                 = modelChanges.map -> model
      openTodos             = modelChanges.map model, 'open'
      completedTodos        = modelChanges.map model, 'completed'
      completedListNotEmpty = modelChanges.map -> model.completed().length > 0

      # EventStreams
      clearCompleted = @$('#clear-completed').asEventStream('click')

      clearCompleted
        .map(model, 'completed')
        .onValue(model, 'remove')

      openTodos
        .map((ts) -> "<strong>#{ts.length}</strong> " + if ts.length == 1 then "item left" else "items left")
        .onValue @$('#todo-count'), 'html'


      completedListNotEmpty
        .onValue @$('#clear-completed'), 'toggle'

      completedTodos
        .onValue (completedTodos) => @$('#clear-completed').text "Clear completed (#{completedTodos.length})"
