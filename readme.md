
Profiles
========

Profiles is a simple way to profile different parts of your app.

#### Install

    npm install profiles

### API

    var profiles = require('profiles')()
    profiles.beg('test1')
    //do something
    profiles.end('test1') //returns the resulting time between beg/end of 'test1'

Each test also comes with its own acessor method that is the same as the name of the test, so:

    profiles.beg('test1')
    //do something
    profiles.end('test1') 
    console.log(profiles.test1)

will print the time it took between the last suite duo of  `beg('test1')` and `end('test1')`.

You can also run a suite of profiles for one given name and profiles will collect an array of beginning and ending time values.
Profiles also provides a convenience `reduce` method to take the ending array and the beginning array and produces a new array with the diffs between their times.


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
          console.log(profiles.reduce('test')) //will print a new array
        }
      }, 100)
    }
    testSet()

To access the begging and ending array call the following functions:

    profiles.begArr(name)
    profiles.endArr(name)
    var both = profiles.times(name) //this will return a two-dimensional array taking the form: [ begArr(name), endArr(name) ]
 

##### MIT License

