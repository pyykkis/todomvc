(function() {

  define(['bacon'], function(Bacon) {
    var TodoApp;
    return TodoApp = (function() {

      function TodoApp(_arg) {
        var showTodos, todos;
        this.el = _arg.el;
        this.main = this.el.find('#main');
        this.footer = this.el.find('#footer');
        todos = new Bacon.Bus();
        showTodos = todos.map(function(todos) {
          return todos.length > 0;
        });
        showTodos.onValue(this.main, 'toggle');
        showTodos.onValue(this.footer, 'toggle');
        todos.push([]);
      }

      return TodoApp;

    })();
  });

}).call(this);
