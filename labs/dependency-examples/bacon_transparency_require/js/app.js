(function() {
  var __slice = [].slice;

  define(['bacon', 'models/todo', 'models/todo_list', 'controllers/footer'], function(Bacon, Todo, TodoList, FooterController) {
    var TodoApp;
    return TodoApp = (function() {
      var ENTER_KEY, enterPressed, getTodo, value;

      ENTER_KEY = 13;

      enterPressed = function(e) {
        return e.keyCode === ENTER_KEY;
      };

      value = function(e) {
        return e.target.value.trim();
      };

      getTodo = function(model) {
        return function(e) {
          return model.get(e.target.transparency.model);
        };
      };

      TodoApp.prototype.$ = function() {
        var args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (_ref = this.el).find.apply(_ref, args);
      };

      function TodoApp(_arg) {
        var deleteTodo, editTodo, finishEdit, footerController, newTodo, todoList, toggleAll, toggleTodo,
          _this = this;
        this.el = _arg.el;
        todoList = new TodoList();
        footerController = new FooterController({
          el: this.$('#footer'),
          todoList: todoList
        });
        toggleAll = this.$('#toggle-all').asEventStream('click');
        toggleTodo = this.$('#todo-list').asEventStream('click', '.toggle');
        deleteTodo = this.$('#todo-list').asEventStream('click', '.destroy');
        editTodo = this.$('#todo-list').asEventStream('dblclick', '.title');
        finishEdit = this.$('#todo-list').asEventStream('keyup', '.edit').filter(enterPressed);
        newTodo = this.$('#new-todo').asEventStream('keyup').filter(enterPressed).map(value).filter('.length');
        toggleAll.map('.target.checked').onValue(todoList, 'toggleAll');
        toggleTodo.map(getTodo(todoList)).onValue(function(todo) {
          return todo.save({
            completed: !todo.get('completed')
          });
        });
        deleteTodo.map(getTodo(todoList)).onValue(function(todo) {
          return todo.destroy();
        });
        editTodo.onValue(function(e) {
          return $(e.currentTarget).closest('.todo').addClass('editing').find('.edit').focus();
        });
        finishEdit.map(function(e) {
          return {
            todo: getTodo(todoList)(e),
            title: value(e)
          };
        }).onValue(function(_arg1) {
          var title, todo;
          todo = _arg1.todo, title = _arg1.title;
          return todo.save({
            title: title
          });
        });
        newTodo.onValue(function(title) {
          return todoList.create({
            title: title
          });
        });
        newTodo.onValue(this.$('#new-todo'), 'val', '');
        todoList.notEmpty.onValue(this.$('#main, #footer'), 'toggle');
        todoList.allCompleted.onValue(this.$('#toggle-all'), 'prop', 'checked');
        todoList.changed.onValue(function(todos) {
          return _this.$('#todo-list').render(todoList.toJSON(), {
            todo: {
              'class': function(p) {
                if (this.completed) {
                  return "todo completed";
                } else {
                  return "todo";
                }
              }
            },
            toggle: {
              checked: function(p) {
                $(p.element).prop('checked', this.completed);
              }
            }
          });
        });
        todoList.fetch();
      }

      return TodoApp;

    })();
  });

}).call(this);
