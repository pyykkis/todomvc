(function() {

  define(['bacon'], function(Bacon) {
    var FooterController;
    return FooterController = (function() {

      function FooterController(_arg) {
        var completedListNotEmpty, completedTodos, openTodos, todos,
          _this = this;
        this.el = _arg.el, this.todoBus = _arg.todoBus;
        todos = this.todoBus.toProperty();
        openTodos = todos.map(function(ts) {
          return ts.filter(function(t) {
            return !t.completed;
          });
        });
        completedTodos = todos.map(function(ts) {
          return ts.filter(function(t) {
            return t.completed;
          });
        });
        completedListNotEmpty = completedTodos.map(function(ts) {
          return ts.length > 0;
        });
        this.el.find('#clear-completed').asEventStream('click').map(openTodos).onValue(this.todoBus, 'push');
        openTodos.map(function(ts) {
          return ("<strong>" + ts.length + "</strong> ") + (ts.length === 1 ? "item left" : "items left");
        }).onValue(this.el.find('#todo-count'), 'html');
        completedListNotEmpty.onValue(this.el.find('#clear-completed'), 'toggle');
        completedTodos.onValue(function(completedTodos) {
          return _this.el.find('#clear-completed').text("Clear completed (" + completedTodos.length + ")");
        });
      }

      return FooterController;

    })();
  });

}).call(this);
