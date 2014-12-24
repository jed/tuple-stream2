var through = require("through2")
var async = require("async")
var read = require("stream-read")

module.exports = function(streams, options) {
  if (!options) options = {}

  var ctor = streams.constructor
  var comparator = options.comparator || function(){ return 0 }
  var tuples = through.obj()
  var sources = Object.keys(streams).map(function(key) {
    return {key: key, stream: streams[key]}
  })

  check()

  return tuples

  function check() {
    async.each(sources, onSource, onDone)

    function onSource(source, cb) {
      if ("value" in source) cb()

      else read(source.stream, function(err, value) {
        if (err) return cb(err)

        source.value = value
        cb()
      })
    }

    function onDone(err) {
      var done = sources.every(function(source) {
        return source.value === null
      })

      if (done) return tuples.end()

      var first = sources
        .slice(0)
        .sort(function(a, b){ return comparator(a.value, b.value) })
        .shift()

      var tuple = sources
        .filter(function(source) {
          return comparator(source.value, first.value) == 0
        })
        .reduce(function(acc, source) {
          acc[source.key] = source.value
          delete source.value
          return acc
        }, new ctor)

      tuples.write(tuple)
      check()
    }
  }
}
