(function() {

  define(['bacon'], function(Bacon) {
    var TodoApp;
    return TodoApp = (function() {
      var ENTER_KEY;

      ENTER_KEY = 13;

      function TodoApp(_arg) {
        var enter, keyup, newTodo, showTodos, todos;
        this.el = _arg.el;
        todos = new Bacon.Bus();
        keyup = this.el.find('#new-todo').asEventStream('keyup');
        enter = keyup.filter(function(e) {
          return e.keyCode === ENTER_KEY;
        });
        newTodo = keyup.toProperty().sampledBy(enter).map(function(e) {
          return e.target.value.trim();
        }).filter(function(val) {
          return val.length > 0;
        });
        showTodos = todos.map(function(todos) {
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
        showTodos.onValue(this.el.find('#main'), 'toggle');
        showTodos.onValue(this.el.find('#footer'), 'toggle');
        todos.push([]);
        todos.log();
      }

      return TodoApp;

    })();
  });

}).call(this);
