var profiles = require('../profiles.js')
   , assert = require('assert')
   , profiler = profiles()

setInterval(function() {
  profiler.beg('one')
  for (var i = 0; i < 100000000; i++) {}
  profiler.end('one')
}, 1000)


setInterval(function() {
  profiler.beg('two')
  for (var i = 0; i < 1000000; i++) {}
  profiler.end('two')
}, 1000)

setInterval(function() {
  profiler.stat('three', 200)
}, 1000)

profiles.PS(profiler).filter('one', 'two').pipe(process.stdout)
