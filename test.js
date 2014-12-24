var assert = require("assert")
var through = require("through2")
var concat = require("concat-stream")
var TupleStream = require("./")

var streams = {
  before: through.obj(),
  after: through.obj()
}

streams.before.write({id: 1, name: "Moe"})
streams.before.write({id: 2, name: "Shemp"})
streams.before.write({id: 3, name: "Larry"})
streams.before.end()

streams.after.write({id: 1, name: "Moe"})
streams.after.write({id: 3, name: "Larry"})
streams.after.write({id: 4, name: "Curly"})
streams.after.end()

function comparator(a, b){ return !a ? 1 : !b ? -1 : a.id - b.id }

var stream = TupleStream(streams, {comparator: comparator})
var write = concat(function(tuples) {
  assert.deepEqual(tuples, [
    {before: {id: 1, name: "Moe"}, after: {id: 1, name: "Moe"}},
    {before: {id: 2, name: "Shemp"}},
    {before: {id: 3, name: "Larry"}, after: {id: 3, name: "Larry"}},
    {after: {id: 4, name: "Curly"}}
  ])
})

stream.pipe(write)
