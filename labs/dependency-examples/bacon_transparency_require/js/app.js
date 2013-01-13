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
        }).log();
        showTodos = todos.map(function(todos) {
          return todos.length > 0;
        });
        showTodos.onValue(this.el.find('#main'), 'toggle');
        showTodos.onValue(this.el.find('#footer'), 'toggle');
        todos.push([]);
      }

      return TodoApp;

    })();
  });

}).call(this);
