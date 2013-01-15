define ['bacon', 'backbone', 'lodash', 'controllers/footer'], (Bacon, Backbone, _, FooterController) ->

  Backbone.EventStream =
    asEventStream: (eventName, eventTransformer = _.identity) ->
      eventTarget = this
      new Bacon.EventStream (sink) ->
        handler = (args...) ->
          reply = sink(new Bacon.Next(eventTransformer args...))
          if reply == Bacon.noMore
            unbind()

        unbind = -> eventTarget.off(eventName, handler)
        eventTarget.on(eventName, handler, this)
        unbind

  _.extend Backbone.Model.prototype, Backbone.EventStream
  _.extend Backbone.Collection.prototype, Backbone.EventStream

  class Todo extends Backbone.Model
  class TodoList extends Backbone.Collection
    model: Todo

  class TodoApp
    ENTER_KEY    = 13
    enterPressed = (e) -> e.keyCode == ENTER_KEY

    constructor: ({@el}) ->
      todoBus          = new Bacon.Bus()
      footerController = new FooterController(el: @el.find('#footer'), todoBus: todoBus)

      # Properties
      todos            = todoBus.map((ts) -> ts.filter (t) -> t.title != "").toProperty().log()
      todoListNotEmpty = todos.map((ts) -> ts.length > 0)
      allCompleted     = todos.map((ts) -> ts.filter((t) -> !t.completed).length == 0)

      # EventStreams
      deleteTodo = @el.find('#todo-list').asEventStream('click',    '.todo .destroy')
      toggleTodo = @el.find('#todo-list').asEventStream('click',    '.todo .toggle')
      editTodo   = @el.find('#todo-list').asEventStream('dblclick', '.todo', (e) -> console.log e; e).log()
      finishEdit = @el.find('#todo-list').asEventStream('keyup',    '.edit').filter(enterPressed)
      toggleAll  = @el.find('#toggle-all').asEventStream('click')
      newTodo    = @el.find('#new-todo').asEventStream('keyup')
        .filter(enterPressed)
        .map((e) -> t: {title: e.target.value.trim(), completed: false})
        .filter('.t.title')

      # Side effects
      deleteTodo
        .map((e) -> d: e.target.transparency.model)
        .decorateWith('ts', todos)
        .onValue(({ts, d}) -> todoBus.push ts.filter (t) -> t != d)

      toggleTodo
        .map('.target.transparency.model')
        .onValue((t) -> t.completed = !t.completed)

      editTodo
        .onValue((e) -> $(e.currentTarget).addClass('editing').find('.edit').focus())

      finishEdit
        .onValue((e) -> e.target.transparency.model.title = e.target.value)

      toggleAll
        .map((e) -> completed: e.target.checked)
        .decorateWith('ts', todos)
        .onValue(({ts, completed}) ->
          todoBus.push ts.map((t) -> t.completed = completed; t))

      newTodo
        .decorateWith('ts', todos)
        .onValue(({ts, t}) -> todoBus.push ts.concat [t])

      newTodo.onValue          @el.find('#new-todo'),   'val', ''
      todoListNotEmpty.onValue @el.find('#main'),       'toggle'
      todoListNotEmpty.onValue @el.find('#footer'),     'toggle'
      allCompleted.onValue     @el.find('#toggle-all'), 'prop', 'checked'

      todos.onValue (todos) =>
        @el.find('#todo-list').render todos,
          todo: 'class': (p) -> if @completed then "todo completed" else "todo"
          # Ugly, fix Transparency
          toggle: checked: (p) -> $(p.element).prop('checked', @completed); return

      # Kickstart
      todoBus.plug toggleTodo.map(todos)
      todoBus.plug finishEdit.map(todos)
      todoBus.push []
