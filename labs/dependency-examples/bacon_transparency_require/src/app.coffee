define ['bacon', 'models/todo', 'models/todo_list', 'controllers/footer'], (Bacon, Todo, TodoList, FooterController) ->

  class TodoApp
    ENTER_KEY    = 13
    enterPressed = (e)     -> e.keyCode == ENTER_KEY
    value        = (e)     -> e.target.value.trim()
    getTodo      = (model) -> (e) -> model.get e.target.transparency.model

    $: (args...) -> @el.find args...

    constructor: ({@el}) ->
      todoList         = new TodoList()
      footerController = new FooterController(el: @$('#footer'), todoList: todoList)

      # EventStreams
      toggleAll  = @$('#toggle-all').asEventStream('click')
      toggleTodo = @$('#todo-list').asEventStream('click',    '.toggle')
      deleteTodo = @$('#todo-list').asEventStream('click',    '.destroy')
      editTodo   = @$('#todo-list').asEventStream('dblclick', '.title')
      finishEdit = @$('#todo-list').asEventStream('keyup',    '.edit').filter(enterPressed)
      newTodo    = @$('#new-todo').asEventStream('keyup')
        .filter(enterPressed)
        .map(value)
        .filter('.length')

      toggleAll
        .map('.target.checked')
        .onValue(todoList, 'toggleAll')

      toggleTodo
        .map(getTodo(todoList))
        .onValue((todo) -> todo.save completed: !todo.get 'completed')

      deleteTodo
        .map(getTodo(todoList))
        .onValue((todo) -> todo.destroy())

      editTodo
        .onValue((e) -> $(e.currentTarget).closest('.todo').addClass('editing').find('.edit').focus())

      finishEdit
        .map((e) -> todo: getTodo(todoList)(e), title: value(e))
        .onValue(({todo, title}) -> todo.save title: title)

      newTodo
        .onValue((title) -> todoList.create title: title)

      newTodo.onValue                 @$('#new-todo'),      'val', ''
      todoList.notEmpty.onValue     @$('#main, #footer'), 'toggle'
      todoList.allCompleted.onValue @$('#toggle-all'),    'prop', 'checked'

      todoList.changed.onValue (todos) =>
        @$('#todo-list').render todoList.toJSON(),
          todo: 'class': (p) -> if @completed then "todo completed" else "todo"
          # Ugly, fix Transparency
          toggle: checked: (p) -> $(p.element).prop('checked', @completed); return

      todoList.fetch()
