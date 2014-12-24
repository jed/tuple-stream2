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

var tuples = TupleStream(streams, comparator)

tuples.on("data", console.log)

// {a: {id: 1}}
// {a: {id: 2}}
// {b: {id: 3}}
// {b: {id: 4}}
// {a: {id: 5}, b: {id: 5}}
```

API
---

### TupleStream(streams, [comparator])

Returns a readable stream.

`streams` is a required object or array of readable streams, each of which must already be sorted according to the `comparator`. To use an unsorted stream, first pipe it through something like [sort-stream2](https://github.com/jed/sort-stream2).

`comparator` is an optional function used to sort streams. It follows the specification used for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), and defaults to `function(){ return 0 }`.

The returned stream emits values with the same keys as `streams`, but with stream _data_ instead of streams for the values.
