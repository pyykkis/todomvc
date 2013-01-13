define ['bacon'], (Bacon) ->

  class TodoApp
    ENTER_KEY = 13

    constructor: ({@el}) ->
       # Events and Properties
      todos = new Bacon.Bus().log()

      newTodo = @el.find('#new-todo').asEventStream('keyup')
        .filter((e) -> e.keyCode == ENTER_KEY)
        .map((e) -> todo: e.target.value.trim())
        .filter(({todo}) -> todo.length > 0)

      showTodos = todos.map((todos) -> todos.length > 0)

      # Side effects
      newTodo.map((t) -> t: t)
        .decorateWith('ts', todos.toProperty())
        .onValue(({ts, t}) -> todos.push ts.concat [t])

      todos.onValue     @el.find('#todo-list'), 'render'
      showTodos.onValue @el.find('#main'),      'toggle'
      showTodos.onValue @el.find('#footer'),    'toggle'
      newTodo.onValue   @el.find('#new-todo'),  'val', ''

      # Kickstart
      todos.push []
