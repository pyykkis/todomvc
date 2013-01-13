define ['bacon'], (Bacon) ->

  class TodoApp
    ENTER_KEY = 13

    constructor: ({@el}) ->
      todoBus = new Bacon.Bus()
      todos   = todoBus.toProperty().log()

      newTodo = @el.find('#new-todo')
        .asEventStream('keyup')
        .filter((e) -> e.keyCode == ENTER_KEY)
        .map((e) -> todo: e.target.value.trim(), completed: false)
        .filter(({todo}) -> todo.length > 0)

      deletedTodo = @el.find('#todo-list .destroy')
        .asEventStream('click')
        .map('.target.transparency.model')

      toggledTodo = @el.find('#todo-list .toggle')
        .asEventStream('click')
        .map('.target.transparency.model')

      todoListNotEmpty = todos.map((todos) -> todos.length > 0)

      # Side effects

      # Add new todo to the list
      newTodo.map((t) -> t: t)
        .decorateWith('ts', todos)
        .onValue(({ts, t}) -> todoBus.push ts.concat [t])

      # Delete todo from the list
      deletedTodo.map((t) -> d: d)
        .decorateWith('ts', todos)
        .onValue(({ts, d}) -> todoBus.push ts.filter (t) -> t != d)

      # Toggle todo
      toggledTodo.onValue((t) -> t.completed = !t.completed)

      # Update view
      newTodo.onValue          @el.find('#new-todo'), 'val', ''
      todoListNotEmpty.onValue @el.find('#main'),     'toggle'
      todoListNotEmpty.onValue @el.find('#footer'),   'toggle'

      toggledTodo.map(todos)
        .merge(todos).onValue @el.find('#todo-list'), 'render'

      # Kickstart
      todoBus.push []
