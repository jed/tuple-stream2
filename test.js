var assert = require("assert")
var through = require("through2")
var concat = require("concat-stream")
var TupleStream = require("./")

var streams = {
  a: through.obj(),
  b: through.obj()
}

streams.a.write({id: 1})
streams.a.write({id: 2})
streams.a.write({id: 5})
streams.a.end()

streams.b.write({id: 3})
streams.b.write({id: 4})
streams.b.write({id: 5})
streams.b.end()

function comparator(a, b){ return a.id - b.id }

var stream = TupleStream(streams, comparator)
var write = concat(function(tuples) {
  assert.deepEqual(tuples, [
    {a: {id: 1}},
    {a: {id: 2}},
    {b: {id: 3}},
    {b: {id: 4}},
    {a: {id: 5}, b: {id: 5}}
  ])
})

stream.pipe(write)
