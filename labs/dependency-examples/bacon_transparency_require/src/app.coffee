define (require) ->
  Backbone         = require 'backbone'
  Bacon            = require 'bacon'
  Todo             = require 'models/todo'
  TodoList         = require 'models/todo_list'
  FooterController = require 'controllers/footer'

  class TodoApp extends Backbone.View
    ENTER_KEY    = 13
    enterPressed = (e) -> e.keyCode == ENTER_KEY
    value        = (e) -> e.target.value.trim()

    initialize: ->
      @todoList         = new TodoList()
      footerController = new FooterController(el: @$('#footer'), collection: @todoList)

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
        .onValue(@todoList, 'toggleAll')

      toggleTodo
        .map(@getTodo)
        .onValue((todo) -> todo.save completed: !todo.get 'completed')

      deleteTodo
        .map(@getTodo)
        .onValue((todo) -> todo.destroy())

      editTodo
        .onValue((e) -> $(e.currentTarget).closest('.todo').addClass('editing').find('.edit').focus())

      finishEdit
        .map((e) -> todo: @getTodo(e), title: value(e))
        .onValue(({todo, title}) -> todo.save title: title)

      newTodo.onValue((title) -> @todoList.create title: title)

      newTodo.onValue                @$('#new-todo'),      'val', ''
      @todoList.notEmpty.onValue     @$('#main, #footer'), 'toggle'
      @todoList.allCompleted.onValue @$('#toggle-all'),    'prop', 'checked'
      @todoList.changed.onValue      @render

      @todoList.fetch()

    getTodo: (e) => @todoList.get e.target.transparency.model

    render: (todos) =>
      @$('#todo-list').render todos.toJSON(),
        todo:     class: (p) -> if @completed then "todo completed" else "todo"
        toggle: checked: (p) -> @completed
