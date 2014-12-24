tuple-stream2
=============

[![build status](https://secure.travis-ci.org/jed/tuple-stream2.svg)](http://travis-ci.org/jed/tuple-stream2)

Merges multiple sorted streams into an aligned tuple stream.

Example
-------

```javascript
var through = require("through2")
var TupleStream = require("tuple-stream2")

// an object map of streams, but could also be an array
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

var tuples = TupleStream(stooges, {comparator: comparator})

tuples.on("data", console.log)

//  {before: {id: 1, name: "Moe"  }, after: {id: 1, name: "Moe"}  },
//  {before: {id: 2, name: "Shemp"}                               },
//  {before: {id: 3, name: "Larry"}, after: {id: 3, name: "Larry"}},
//  {                                after: {id: 4, name: "Curly"}}
```

API
---

### TupleStream(streams, [options])

Returns a readable stream.

`streams` is a required object or array of readable streams, each of which must already be sorted according to the `comparator`. To use an unsorted stream, first pipe it through something like [sort-stream2](https://github.com/jed/sort-stream2).

`options` is an optional object that can contain the following key:

- `comparator`: an optional function used to sort streams. It follows the specification used for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), and defaults to `function(){ return 0 }`.

The returned stream emits values with the same keys as `streams`, but with stream _data_ instead of streams for the values.
