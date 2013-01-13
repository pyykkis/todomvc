(function() {

  define(['bacon'], function(Bacon) {
    var TodoApp;
    return TodoApp = (function() {
      var ENTER_KEY;

      ENTER_KEY = 13;

      function TodoApp(_arg) {
        var deletedTodo, newTodo, todoListNotEmpty, todos;
        this.el = _arg.el;
        todos = new Bacon.Bus().log();
        newTodo = this.el.find('#new-todo').asEventStream('keyup').filter(function(e) {
          return e.keyCode === ENTER_KEY;
        }).map(function(e) {
          return {
            todo: e.target.value.trim()
          };
        }).filter(function(_arg1) {
          var todo;
          todo = _arg1.todo;
          return todo.length > 0;
        });
        deletedTodo = this.el.find('#todo-list .destroy').asEventStream('click').map('.target.transparency.model');
        todoListNotEmpty = todos.map(function(todos) {
          return todos.length > 0;
        });
        newTodo.map(function(t) {
          return {
            t: t
          };
        }).decorateWith('ts', todos.toProperty()).onValue(function(_arg1) {
          var t, ts;
          ts = _arg1.ts, t = _arg1.t;
          return todos.push(ts.concat([t]));
        });
        deletedTodo.map(function(d) {
          return {
            d: d
          };
        }).decorateWith('ts', todos.toProperty()).onValue(function(_arg1) {
          var d, ts;
          ts = _arg1.ts, d = _arg1.d;
          return todos.push(ts.filter(function(t) {
            return t !== d;
          }));
        });
        newTodo.onValue(this.el.find('#new-todo'), 'val', '');
        todos.onValue(this.el.find('#todo-list'), 'render');
        todoListNotEmpty.onValue(this.el.find('#main'), 'toggle');
        todoListNotEmpty.onValue(this.el.find('#footer'), 'toggle');
        todos.push([]);
      }

      return TodoApp;

    })();
  });

}).call(this);
