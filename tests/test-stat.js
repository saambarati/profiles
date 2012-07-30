
var http = require('http')
  , reqPerSec = 0
  , profiles = require('../profiles')
  , profiler = profiles()
  , server

function serve(req, res) {
  reqPerSec +=1
  res.statusCode = 200
  res.setHeader('content-type', 'text/plain')
  res.end('request per sec #' + reqPerSec)
}

profiles.ProfilesStream(profiler).pipe(process.stdout)

http.createServer(serve).listen(8081)

setInterval(function() {
  profiler.stat('perSec', reqPerSec)
  reqPerSec = 0
}, 1000)

