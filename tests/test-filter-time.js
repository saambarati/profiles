var profiles = require('../profiles.js')
   , assert = require('assert')
   , profiler = profiles()

setInterval(function() {
  var end = profiler.beg('one')
  setTimeout(function() {
    end()
  }, 1000)
}, 1000)


setInterval(function() {
  var end = profiler.beg('two')
  setTimeout(function() {
    end()
  }, 500)
}, 1000)


var statVal = 200
setInterval(function() {
  profiler.stat('three', statVal)
}, 1000)

profiles.PS(profiler).filter('one', 'two')
  .on('data', function(stat) {
    stat = stat.toString()
    stat = JSON.parse(stat)
    assert(stat.name === 'one' || stat.name === 'two')
    console.log('passed fileter assertion')
  })
  .pipe(process.stdout)

var timeTillEnd = 3000
var endingStream = profiles.PS(profiler, timeTillEnd).filter('three')
  .on('data', function(stat) {
    stat = stat.toString()
    stat = JSON.parse(stat)
    assert(stat.name === 'three')
    assert(stat.val === statVal)
    //console.log('passed assertion')
  })
  .on('end', function() {
    console.log('stream filteredBy:"three" ended')
  })

//endingStream.pipe(process.stdout)

setTimeout(function() {
  assert(endingStream._alreadyEnded === true)
  console.log('passed all assertions')
  console.log('process is exiting')
  process.exit(0)
}, timeTillEnd + 10)

