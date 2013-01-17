(function() {
  var __slice = [].slice;

  define(['bacon', 'underscore'], function(Bacon, _) {
    var FooterController;
    return FooterController = (function() {

      FooterController.prototype.$ = function() {
        var args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (_ref = this.el).find.apply(_ref, args);
      };

      function FooterController(_arg) {
        var clearCompleted, todoList,
          _this = this;
        this.el = _arg.el, todoList = _arg.todoList;
        clearCompleted = this.$('#clear-completed').asEventStream('click');
        clearCompleted.map(todoList.completed).onValue(function(ts) {
          return _.invoke(ts, 'destroy');
        });
        todoList.open.map(function(ts) {
          return ("<strong>" + ts.length + "</strong> ") + (ts.length === 1 ? "item left" : "items left");
        }).onValue(this.$('#todo-count'), 'html');
        todoList.someCompleted.onValue(this.$('#clear-completed'), 'toggle');
        todoList.completed.onValue(function(completedTodos) {
          return _this.$('#clear-completed').text("Clear completed (" + completedTodos.length + ")");
        });
      }

      return FooterController;

    })();
  });

}).call(this);
