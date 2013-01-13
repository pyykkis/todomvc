define ['bacon', 'controllers/footer'], (Bacon, FooterController) ->

  class TodoApp
    ENTER_KEY = 13

    constructor: ({@el}) ->
      todoBus          = new Bacon.Bus().log()
      footerController = new FooterController(el: @el.find('#footer'), todoBus: todoBus)

      todos            = todoBus.toProperty()
      todoListNotEmpty = todos.map((ts) -> ts.length > 0)

      newTodo = @el.find('#new-todo')
        .asEventStream('keyup')
        .filter((e) -> e.keyCode == ENTER_KEY)
        .map((e) -> todo: e.target.value.trim(), completed: false)
        .filter(({todo}) -> todo.length > 0)

      deletedTodo = @el.find('#todo-list')
        .asEventStream('click', '.destroy')
        .map('.target.transparency.model')

      toggledTodo = @el.find('#todo-list')
        .asEventStream('click', '.toggle')
        .map('.target.transparency.model')

      #### Side effects

      # Add new todo to the list
      newTodo.map((t) -> t: t)
        .decorateWith('ts', todos)
        .onValue(({ts, t}) -> todoBus.push ts.concat [t])

      # Delete todo from the list
      deletedTodo.map((t) -> d: d)
        .decorateWith('ts', todos)
        .onValue(({ts, d}) -> todoBus.push ts.filter (t) -> t != d)

      # Toggle todo
      toggledTodo.onValue((t) -> t.completed = not t.completed)

      # Update view
      newTodo.onValue          @el.find('#new-todo'),  'val', ''
      todoListNotEmpty.onValue @el.find('#main'),      'toggle'
      todoListNotEmpty.onValue @el.find('#footer'),    'toggle'
      todos.onValue (todos) =>
        @el.find('#todo-list').render todos,
          # Ugly, fix Transparency
          toggle: checked: (p) -> $(p.element).prop('checked', @completed); return

      # Kickstart
      todoBus.plug toggledTodo.map(todos)
      todoBus.push []
