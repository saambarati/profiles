
Profiles
========


Profiles is a simple way to profile different parts of your app.

#### Install

    npm install profiles


## API
### Note, These API's *will* change

### Timing

    var profiles = require('profiles')()
    var end = profiles.beg('test1')
    //do something that will take some time
    end() //returns the time from beg to the time end was invoked


### Stats
You can also create stats about certain parts of your app using the `profiler.stat(name, value)` API. If you want to stat how 
many request per second your server is handling, you can do the following (this ties in nicely with `ProfilesStream`):

    var reqPerSec = 0
    function serve(req, res) {
      reqPerSec +=1
      res.setHeader('content-type', 'text/plain')
      res.end('request per sec #' + reqPerSec)
    }
    http.createServer(serve).listen(1337)
    setInterval(function() {
      profiler.stat('perSec', reqPerSec)
      reqPerSec = 0
    }, 1000)
    profiles.PS(profiler).pipe(process.stdout)


### Events
Profiles is also an instance of EventEmitter so you can listen to the `profile` event which takes a listener function:

     function(profileName, value, profileType) {}
     /*
      * profileName will be the name of the stat or time
      * value is the 'time' it took  before the end() function was invoked or the 'stat' value when you call stat()
      * profileType will be the type of profile you invoked, so: 'stat' or 'time'
     */

### ProfilesStream
You can also wrap your profiler in a `readable stream`:

    var profiles = require('profiles')
      , profiler = profiles()
      , pStream = new profiles.PS(profiler)
      // OR:  pStream = new profiles.ProfilesStream(profiler)

    pStream.pipe(process.stdout)

`ProfilesStream` just listens in on the `"profile"` event and emits `\n` delimited JSON string `Buffer` objects that have the following format:
    
    {'name' : nameOfStatOrTime, 'val': itsValue, '__profileType' : 'time' OR 'stat'}


##### MIT License

