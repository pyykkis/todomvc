(function() {

  define(['bacon'], function(Bacon) {
    var FooterController;
    return FooterController = (function() {

      function FooterController(_arg) {
        var completedListNotEmpty, completedTodos, openTodos, todos,
          _this = this;
        this.el = _arg.el, this.todoBus = _arg.todoBus;
        todos = this.todoBus.toProperty().log();
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
        completedListNotEmpty.onValue(this.el.find('#clear-completed'), 'toggle');
        completedTodos.onValue(function(completedTodos) {
          return _this.el.find('#clear-completed').text("Clear completed (" + completedTodos.length + ")");
        });
      }

      return FooterController;

    })();
  });

}).call(this);
