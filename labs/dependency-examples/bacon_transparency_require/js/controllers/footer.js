(function() {
  var __slice = [].slice;

  define(['bacon'], function(Bacon) {
    var FooterController;
    return FooterController = (function() {

      FooterController.prototype.$ = function() {
        var args, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (_ref = this.el).find.apply(_ref, args);
      };

      function FooterController(_arg) {
        var clearCompleted, completedListNotEmpty, completedTodos, model, modelChanges, openTodos, todos,
          _this = this;
        this.el = _arg.el, model = _arg.model;
        modelChanges = model.asEventStream("add remove reset change");
        todos = modelChanges.map(function() {
          return model;
        });
        openTodos = modelChanges.map(model, 'open');
        completedTodos = modelChanges.map(model, 'completed');
        completedListNotEmpty = modelChanges.map(function() {
          return model.completed().length > 0;
        });
        clearCompleted = this.$('#clear-completed').asEventStream('click');
        clearCompleted.map(model, 'completed').onValue(model, 'remove');
        openTodos.map(function(ts) {
          return ("<strong>" + ts.length + "</strong> ") + (ts.length === 1 ? "item left" : "items left");
        }).onValue(this.$('#todo-count'), 'html');
        completedListNotEmpty.onValue(this.$('#clear-completed'), 'toggle');
        completedTodos.onValue(function(completedTodos) {
          return _this.$('#clear-completed').text("Clear completed (" + completedTodos.length + ")");
        });
      }

      return FooterController;

    })();
  });

}).call(this);
