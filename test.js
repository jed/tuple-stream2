var assert = require("assert")
var through = require("through2")
var concat = require("concat-stream")
var TupleStream = require("./")

var stooges = {
  before: through.obj(),
  after: through.obj()
}

stooges.before.write({id: 1, name: "Moe"})
stooges.before.write({id: 2, name: "Shemp"})
stooges.before.write({id: 3, name: "Larry"})
stooges.before.end()

stooges.after.write({id: 1, name: "Moe"})
stooges.after.write({id: 3, name: "Larry"})
stooges.after.write({id: 4, name: "Curly"})
stooges.after.end()

function comparator(a, b){ return !a ? 1 : !b ? -1 : a.id - b.id }

var stream = TupleStream(stooges, {comparator: comparator})

stream.on("data", console.log)
// var write = concat(function(tuples) {
//   assert.deepEqual(tuples, [
//     {before: {id: 1, name: "Moe"}, after: {id: 1, name: "Moe"}},
//     {before: {id: 2, name: "Shemp"}},
//     {before: {id: 3, name: "Larry"}, after: {id: 3, name: "Larry"}},
//     {after: {id: 4, name: "Curly"}}
//   ])
// })

// stream.pipe(write)
