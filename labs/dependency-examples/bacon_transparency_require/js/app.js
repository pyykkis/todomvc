(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'bacon', 'models/todo', 'models/todo_list', 'controllers/footer'], function(Backbone, Bacon, Todo, TodoList, FooterController) {
    var TodoApp;
    return TodoApp = (function(_super) {
      var ENTER_KEY, enterPressed, getTodo, value;

      __extends(TodoApp, _super);

      function TodoApp() {
        return TodoApp.__super__.constructor.apply(this, arguments);
      }

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

      TodoApp.prototype.initialize = function() {
        var deleteTodo, editTodo, finishEdit, footerController, newTodo, todoList, toggleAll, toggleTodo,
          _this = this;
        todoList = new TodoList();
        footerController = new FooterController({
          el: this.$('#footer'),
          collection: todoList
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
        }).onValue(function(_arg) {
          var title, todo;
          todo = _arg.todo, title = _arg.title;
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
        return todoList.fetch();
      };

      return TodoApp;

    })(Backbone.View);
  });

}).call(this);
