define ['bacon'], (Bacon) ->

  class TodoApp
    ENTER_KEY = 13

    constructor: ({@el}) ->
       # Events and Properties
      todos = new Bacon.Bus()

      keyup   = @el.find('#new-todo').asEventStream('keyup')
      enter   = keyup.filter((e) -> e.keyCode == ENTER_KEY)
      newTodo = keyup.toProperty()
        .sampledBy(enter)
        .map((e) -> e.target.value.trim())
        .filter((val) -> val.length > 0)


      showTodos = todos.map((todos) -> todos.length > 0)

      # Side effects
      newTodo.map((t) -> t: t)
        .decorateWith('ts', todos.toProperty())
        .onValue(({ts, t}) -> todos.push ts.concat [t])

      showTodos.onValue @el.find('#main'),   'toggle'
      showTodos.onValue @el.find('#footer'), 'toggle'

      # Kickstart
      todos.push []
      todos.log()
