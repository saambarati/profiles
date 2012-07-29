
var profiler = require('./profiles.js')()
   , assert = require('assert')

function fib(n) {
  switch (n) {
    case 0 : return 0
    case 1 : return 1
    default : return fib(n-1) + fib(n-2)
  }
}

var i = 1
function testSet() {
  setTimeout(function() {
    if ((i % 2)) {
      profiler.beg('test')   
    } else {
      profiler.end('test')   
    }
    i+=1
    if (i < 20) {
      testSet()
    } else {
      var reduced = profiler.reduce('test')
      console.log('reduced times: ' + reduced)
      console.log('the final time was ' + profiler.test)
      assert(reduced[reduced.length-1] === profiler.test)
    }
  }, 100)
}
testSet()
