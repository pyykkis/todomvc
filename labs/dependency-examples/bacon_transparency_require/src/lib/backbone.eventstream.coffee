define ['backbone'], (Backbone) ->

  Backbone.EventStream =
    asEventStream: (eventName, eventTransformer = _.identity) ->
      eventTarget = this
      new Bacon.EventStream (sink) ->
        handler = (args...) ->
          reply = sink(new Bacon.Next(eventTransformer args...))
          if reply == Bacon.noMore
            unbind()

        unbind = -> eventTarget.off(eventName, handler)
        eventTarget.on(eventName, handler, this)
        unbind
