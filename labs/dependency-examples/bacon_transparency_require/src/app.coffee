define ['bacon', 'backbone', 'lodash', 'controllers/footer'], (Bacon, Backbone, _, FooterController) ->

  class Todo extends Backbone.Model
    defaults: completed: false

  class TodoList extends Backbone.Collection
    model: Todo

    allCompleted:          -> @every (t) -> t.get 'completed'
    toggleAll: (completed) -> @invoke 'set', 'completed', completed
    open:                  -> @reject (t) -> t.get 'completed'
    completed:             -> @filter (t) -> t.get 'completed'

  class TodoApp
    ENTER_KEY    = 13
    enterPressed = (e) -> e.keyCode == ENTER_KEY

    $: (args...) -> @el.find args...

    constructor: ({@el}) ->
      todoIds = 0
      model   = new TodoList()

      footerController = new FooterController(el: @$('#footer'), model: model)

      # Properties
      modelChanges     = model.asEventStream("add remove reset change")
      todos            = modelChanges.map -> model
      todoListNotEmpty = modelChanges.map -> model.length > 0
      allCompleted     = modelChanges.map model, 'allCompleted'

      # EventStreams
      toggleAll  = @$('#toggle-all').asEventStream('click')
      toggleTodo = @$('#todo-list').asEventStream('click', '.todo .toggle')
      deleteTodo = @$('#todo-list').asEventStream('click', '.todo .destroy')
      editTodo   = @$('#todo-list').asEventStream('dblclick', 'label.todo')
      finishEdit = @$('#todo-list').asEventStream('keyup', '.edit').filter(enterPressed)
      newTodo    = @$('#new-todo').asEventStream('keyup')
        .filter(enterPressed)
        .map((e) -> e.target.value.trim())
        .filter(_.identity)

      toggleAll
        .map('.target.checked')
        .onValue(model, 'toggleAll')

      toggleTodo
        .map('.target.transparency.model')
        .map(model, 'get')
        .onValue((t) -> t.set 'completed', !t.get 'completed')

      deleteTodo
        .map('.target.transparency.model')
        .onValue(model, 'remove')

      editTodo
        .onValue((e) -> $(e.currentTarget).addClass('editing').find('.edit').focus())

      finishEdit
        .map((e) -> todo: model.get(e.target.transparency.model), title: e.target.value)
        .onValue(({todo, title}) -> todo.set 'title', title)

      newTodo
        .map((title) -> new Todo(title: title, id: todoIds++))
        .onValue(model, 'add')

      newTodo.onValue          @$('#new-todo'),   'val', ''
      todoListNotEmpty.onValue @$('#main'),       'toggle'
      todoListNotEmpty.onValue @$('#footer'),     'toggle'
      allCompleted.onValue     @$('#toggle-all'), 'prop', 'checked'

      todos.onValue (todos) =>
        @$('#todo-list').render todos.toJSON(),
          todo: 'class': (p) -> if @completed then "todo completed" else "todo"
          # Ugly, fix Transparency
          toggle: checked: (p) -> $(p.element).prop('checked', @completed); return

      # Kickstart
      model.reset()
