
var profiler = require('./profiles.js')()
   , assert = require('assert')

var total = [0,1]
function fib(num) {
  function recurse(n) {
    var res = total[n]
    if (res !== undefined) return res

    res = recurse(n-1) + recurse(n-2)
    total[n] = res
    return res
  }

  return recurse(num)
}

var i = 1
function testSet() {
  setTimeout(function() {
    if ((i % 2)) {
      profiler.beg('test')   
    } else {
      console.log('t:%d is %d', i, profiler.end('test'))
    }
    i+=1
    if (i < 20) {
      testSet()
    } else {
      finished()
    }
  }, 100)
}
testSet()

function finished() {
  var reduced = profiler.reduce('test')
  //console.log('reduced times: ' + reduced)
  //console.log('the final time was ' + profiler.test)
  //console.log('beggining times: ' + profiler.times('test')[0])
  //console.log('ending times: ' + profiler.times('test')[1])

  //profiler.beg('fib')
  //fib(1000)
  //console.log('fib sequence took: %d ms',profiler.end('fib'))

  assert(reduced[reduced.length-1] === profiler.test) //test accessor method
  assert(profiler.times('test'))
  var beg = profiler.times('test')[0]
    , end = profiler.times('test')[1]
  assert(!!beg)
  assert(!!end)
  beg.forEach(function(val, i) {
    assert(val !== end[i])
  })
  assert(beg === profiler.begArr('test'))
  assert(end === profiler.endArr('test'))
}
