
Profiles
========

Profiles is a simple way to profile different parts of your app.

#### Install

    npm install profiles

## API

### Timing

    var profiles = require('profiles')()
    profiles.beg('test1')
    //do something
    profiles.end('test1') //returns the resulting time between beg/end of 'test1'

Each profile also comes with its own acessor method that is the same as the name of the profile, so:

    profiles.beg('test1')
    //do something
    profiles.beg('test2')
    //do something else
    profiles.end('test2')
    profiles.end('test1') 
    console.log(profiles.test1)
    console.log(profiles.test2)

will print the time it took between the `beg('test1')` and `end('test1')` calls.

You can also run a suite of profiles for one given name and profiles will collect an array of beginning and ending time values.
Profiles also provides a convenience `compact` method to take the ending array and the beginning array and produces a new array with the diffs between their times.


    var i = 1
    function testSet() {
      setTimeout(function() {
        if ((i % 2)) {
          profiles.beg('test')
        } else {
          console.log(profiles.end('test')) //prints the most current profile time
        }
        i+=1
        if (i < 20) {
          testSet()
        } else {
          console.log(profiles.compact('test')) //will print a new array
        }
      }, 100)
    }
    testSet()

To access the begging and ending array call the following functions:

    profiles.begArr(name)
    profiles.endArr(name)
    var both = profiles.times(name) //this will return a two-dimensional array taking the form: [ begArr(name), endArr(name) ]


### Stats
You can also create status about certain parts of your app using the `profiler.stat(name, value)` API. If you wanted to stat how 
many request per second your server is handling, you could do the following:

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
    profiles.ProfilesStream(profiler).pipe(process.stdout)


### Events
Profiles is also an instance of EventEmitter so you can listen to the `profile` event which takes a listener function:

     function(profileName, time) {}

### ProfilesStream
You can also wrap your profiler in a `readable stream`:

    var profiles = require('profiles')
      , profiler = profiles()
      , pStream = new profiles.ProfilesStream(profiler)

    pStream.pipe(process.stdout)

`ProfilesStream` just listens in on the `profile` event and emits JSON buffers that have the following format:
    
    {'name' : aName, 'val': aValue}


##### MIT License

