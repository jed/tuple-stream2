var through = require("through2")

module.exports = function(streams, options) {
  if (!options) options = {}

  var ctor = streams.constructor
  var comparator = options.comparator || function(){ return 0 }
  var tuples = []
  var complete = {}
  var stream = through.obj()
  var streamKeys = Object.keys(streams)

  streamKeys.forEach(function(key) {
    var write = through.obj(onData, onEnd)

    streams[key]
      .pipe(write)
      .pipe(stream, {end: false})

    function onData(data, enc, cb) {
      search(0, tuples.length - 1)

      function search(start, end) {
        var middle = Math.floor((start + end) / 2)
        var tuple
        var ref
        var comparison

        if (start > end) {
          tuple = new ctor
          tuples.splice(start, 0, tuple)
        }

        else {
          tuple = tuples[middle]
          ref = tuple[Object.keys(tuple)[0]]
          comparison = comparator(data, ref)

          if (comparison > 0) return search(start, middle - 1)
          if (comparison < 0) return search(middle + 1, end)
        }

        tuple[key] = data

        if (Object.keys(tuple).length < streamKeys.length) return cb()

        tuples.splice(middle, 1)
        cb(null, tuple)
      }
    }

    function onEnd(cb) {
      complete[key] = true

      if (Object.keys(complete).length < streamKeys.length) return cb()

      tuples.forEach(stream.write, stream)
      stream.end()

      cb()
    }
  })

  return stream
}
