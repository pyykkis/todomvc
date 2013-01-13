define ['bacon'], (Bacon) ->

  class TodoApp
    ENTER_KEY = 13

    constructor: ({@el}) ->
      todos = new Bacon.Bus().log()

      newTodo = @el.find('#new-todo')
        .asEventStream('keyup')
        .filter((e) -> e.keyCode == ENTER_KEY)
        .map((e) -> todo: e.target.value.trim())
        .filter(({todo}) -> todo.length > 0)

      deletedTodo = @el.find('#todo-list .destroy')
        .asEventStream('click')
        .map('.target.transparency.model')

      todoListNotEmpty = todos.map((todos) -> todos.length > 0)

      # Add new todo to the list
      newTodo.map((t) -> t: t)
        .decorateWith('ts', todos.toProperty())
        .onValue(({ts, t}) -> todos.push ts.concat [t])

      # Delete todo from the list
      deletedTodo.map((d) -> d: d)
        .decorateWith('ts', todos.toProperty())
        .onValue(({ts, d}) -> todos.push ts.filter (t) -> t != d)

      # Side effects
      newTodo.onValue          @el.find('#new-todo'),  'val', ''
      todos.onValue            @el.find('#todo-list'), 'render'
      todoListNotEmpty.onValue @el.find('#main'),      'toggle'
      todoListNotEmpty.onValue @el.find('#footer'),    'toggle'

      # Kickstart
      todos.push []
