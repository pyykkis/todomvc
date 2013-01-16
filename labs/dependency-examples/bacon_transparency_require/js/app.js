(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['bacon', 'backbone', 'lodash', 'controllers/footer'], function(Bacon, Backbone, _, FooterController) {
    var Todo, TodoApp, TodoList;
    Todo = (function(_super) {

      __extends(Todo, _super);

      function Todo() {
        return Todo.__super__.constructor.apply(this, arguments);
      }

      Todo.prototype.defaults = {
        completed: false
      };

      return Todo;

    })(Backbone.Model);
    TodoList = (function(_super) {

      __extends(TodoList, _super);

      function TodoList() {
        return TodoList.__super__.constructor.apply(this, arguments);
      }

      TodoList.prototype.model = Todo;

      TodoList.prototype.allCompleted = function() {
        return this.every(function(t) {
          return t.get('completed');
        });
      };

      TodoList.prototype.toggleAll = function(completed) {
        return this.invoke('set', 'completed', completed);
      };

      TodoList.prototype.open = function() {
        return this.reject(function(t) {
          return t.get('completed');
        });
      };

      TodoList.prototype.completed = function() {
        return this.filter(function(t) {
          return t.get('completed');
        });
      };

      return TodoList;

    })(Backbone.Collection);
    return TodoApp = (function() {
      var ENTER_KEY, enterPressed;

      ENTER_KEY = 13;

      enterPressed = function(e) {
        return e.keyCode === ENTER_KEY;
      };

      TodoApp.prototype.$ = function() {
        var args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (_ref = this.el).find.apply(_ref, args);
      };

      function TodoApp(_arg) {
        var allCompleted, deleteTodo, editTodo, finishEdit, footerController, model, modelChanges, newTodo, todoIds, todoListNotEmpty, todos, toggleAll, toggleTodo,
          _this = this;
        this.el = _arg.el;
        todoIds = 0;
        model = new TodoList();
        footerController = new FooterController({
          el: this.$('#footer'),
          model: model
        });
        modelChanges = model.asEventStream("add remove reset change");
        todos = modelChanges.map(function() {
          return model;
        });
        todoListNotEmpty = modelChanges.map(function() {
          return model.length > 0;
        });
        allCompleted = modelChanges.map(model, 'allCompleted');
        toggleAll = this.$('#toggle-all').asEventStream('click');
        toggleTodo = this.$('#todo-list').asEventStream('click', '.todo .toggle');
        deleteTodo = this.$('#todo-list').asEventStream('click', '.todo .destroy');
        editTodo = this.$('#todo-list').asEventStream('dblclick', 'label.todo');
        finishEdit = this.$('#todo-list').asEventStream('keyup', '.edit').filter(enterPressed);
        newTodo = this.$('#new-todo').asEventStream('keyup').filter(enterPressed).map(function(e) {
          return e.target.value.trim();
        }).filter(_.identity);
        toggleAll.map('.target.checked').onValue(model, 'toggleAll');
        toggleTodo.map('.target.transparency.model').map(model, 'get').onValue(function(t) {
          return t.set('completed', !t.get('completed'));
        });
        deleteTodo.map('.target.transparency.model').onValue(model, 'remove');
        editTodo.onValue(function(e) {
          return $(e.currentTarget).addClass('editing').find('.edit').focus();
        });
        finishEdit.map(function(e) {
          return {
            todo: model.get(e.target.transparency.model),
            title: e.target.value
          };
        }).onValue(function(_arg1) {
          var title, todo;
          todo = _arg1.todo, title = _arg1.title;
          return todo.set('title', title);
        });
        newTodo.map(function(title) {
          return new Todo({
            title: title,
            id: todoIds++
          });
        }).onValue(model, 'add');
        newTodo.onValue(this.$('#new-todo'), 'val', '');
        todoListNotEmpty.onValue(this.$('#main'), 'toggle');
        todoListNotEmpty.onValue(this.$('#footer'), 'toggle');
        allCompleted.onValue(this.$('#toggle-all'), 'prop', 'checked');
        todos.onValue(function(todos) {
          return _this.$('#todo-list').render(todos.toJSON(), {
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
        model.reset();
      }

      return TodoApp;

    })();
  });

}).call(this);
