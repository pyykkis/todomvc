(function() {
  var __slice = [].slice;

  define(['backbone'], function(Backbone) {
    return Backbone.EventStream = {
      asEventStream: function(eventName, eventTransformer) {
        var eventTarget;
        if (eventTransformer == null) {
          eventTransformer = _.identity;
        }
        eventTarget = this;
        return new Bacon.EventStream(function(sink) {
          var handler, unbind;
          handler = function() {
            var args, reply;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            reply = sink(new Bacon.Next(eventTransformer.apply(null, args)));
            if (reply === Bacon.noMore) {
              return unbind();
            }
          };
          unbind = function() {
            return eventTarget.off(eventName, handler);
          };
          eventTarget.on(eventName, handler, this);
          return unbind;
        });
      }
    };
  });

}).call(this);
