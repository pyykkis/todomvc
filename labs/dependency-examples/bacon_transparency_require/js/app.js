(function() {

  define(['bacon', 'controllers/footer'], function(Bacon, FooterController) {
    var TodoApp;
    return TodoApp = (function() {
      var ENTER_KEY;

      ENTER_KEY = 13;

      function TodoApp(_arg) {
        var allCompleted, deletedTodo, footerController, newTodo, todoBus, todoListNotEmpty, todos, toggleAll, toggledTodo,
          _this = this;
        this.el = _arg.el;
        todoBus = new Bacon.Bus().log();
        footerController = new FooterController({
          el: this.el.find('#footer'),
          todoBus: todoBus
        });
        todos = todoBus.toProperty();
        todoListNotEmpty = todos.map(function(ts) {
          return ts.length > 0;
        });
        allCompleted = todos.map(function(ts) {
          return ts.filter(function(t) {
            return !t.completed;
          }).length === 0;
        });
        newTodo = this.el.find('#new-todo').asEventStream('keyup').filter(function(e) {
          return e.keyCode === ENTER_KEY;
        }).map(function(e) {
          return {
            todo: e.target.value.trim(),
            completed: false
          };
        }).filter(function(_arg1) {
          var todo;
          todo = _arg1.todo;
          return todo.length > 0;
        });
        deletedTodo = this.el.find('#todo-list').asEventStream('click', '.destroy').map('.target.transparency.model');
        toggledTodo = this.el.find('#todo-list').asEventStream('click', '.toggle').map('.target.transparency.model');
        toggleAll = this.el.find('#toggle-all').asEventStream('click').map('.target.checked');
        newTodo.map(function(t) {
          return {
            t: t
          };
        }).decorateWith('ts', todos).onValue(function(_arg1) {
          var t, ts;
          ts = _arg1.ts, t = _arg1.t;
          return todoBus.push(ts.concat([t]));
        });
        deletedTodo.map(function(t) {
          return {
            d: d
          };
        }).decorateWith('ts', todos).onValue(function(_arg1) {
          var d, ts;
          ts = _arg1.ts, d = _arg1.d;
          return todoBus.push(ts.filter(function(t) {
            return t !== d;
          }));
        });
        toggledTodo.onValue(function(t) {
          return t.completed = !t.completed;
        });
        toggleAll.map(function(completed) {
          return {
            completed: completed
          };
        }).decorateWith('ts', todos).onValue(function(_arg1) {
          var completed, ts;
          ts = _arg1.ts, completed = _arg1.completed;
          return todoBus.push(ts.map(function(t) {
            t.completed = completed;
            return t;
          }));
        });
        newTodo.onValue(this.el.find('#new-todo'), 'val', '');
        todoListNotEmpty.onValue(this.el.find('#main'), 'toggle');
        todoListNotEmpty.onValue(this.el.find('#footer'), 'toggle');
        allCompleted.onValue(this.el.find('#toggle-all'), 'prop', 'checked');
        todos.onValue(function(todos) {
          return _this.el.find('#todo-list').render(todos, {
            toggle: {
              checked: function(p) {
                $(p.element).prop('checked', this.completed);
              }
            }
          });
        });
        todoBus.plug(toggledTodo.map(todos));
        todoBus.push([]);
      }

      return TodoApp;

    })();
  });

}).call(this);
