define ['bacon', 'controllers/footer'], (Bacon, FooterController) ->

  class TodoApp
    ENTER_KEY = 13

    constructor: ({@el}) ->
      todoBus          = new Bacon.Bus().log()
      footerController = new FooterController(el: @el.find('#footer'), todoBus: todoBus)

      # Properties
      todos            = todoBus.toProperty()
      todoListNotEmpty = todos.map((ts) -> ts.length > 0)
      allCompleted     = todos.map((ts) -> ts.filter((t) -> !t.completed).length == 0)

      # Events
      deleteTodo = @el.find('#todo-list').asEventStream('click', '.destroy')
      toggleTodo = @el.find('#todo-list').asEventStream('click', '.toggle')
      toggleAll  = @el.find('#toggle-all').asEventStream('click')
      newTodo    = @el.find('#new-todo').asEventStream('keyup')
        .filter((e) -> e.keyCode == ENTER_KEY)
        .map((e) -> t: {todo: e.target.value.trim(), completed: false})
        .filter(({t: {todo}}) -> todo.length > 0)

      #### Side effects

      newTodo
        .decorateWith('ts', todos)
        .onValue(({ts, t}) -> todoBus.push ts.concat [t])

      deleteTodo
        .map((e) -> d: e.target.transparency.model)
        .decorateWith('ts', todos)
        .onValue(({ts, d}) -> todoBus.push ts.filter (t) -> t != d)

      toggleTodo
        .map('.target.transparency.model')
        .onValue((t) -> t.completed = !t.completed)

      toggleAll
        .map((e) -> completed: e.target.checked)
        .decorateWith('ts', todos)
        .onValue(({ts, completed}) ->
          todoBus.push ts.map((t) -> t.completed = completed; t))

      newTodo.onValue          @el.find('#new-todo'),   'val', ''
      todoListNotEmpty.onValue @el.find('#main'),       'toggle'
      todoListNotEmpty.onValue @el.find('#footer'),     'toggle'
      allCompleted.onValue     @el.find('#toggle-all'), 'prop', 'checked'
      todos.onValue (todos) =>
        @el.find('#todo-list').render todos,
          # Ugly, fix Transparency
          toggle: checked: (p) -> $(p.element).prop('checked', @completed); return

      # Kickstart
      todoBus.plug toggleTodo.map(todos)
      todoBus.push []
