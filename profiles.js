
var util = require('util')
  , events = require('events')
  , Stream = require('stream')
  //constants
  , kTypeTime = 'time'
  , kTypeStat = 'stat'

//return a unique id
function uid() {
  return Date.now() //TODO, consider something more mathematically comprehensive
}
function Profiles () {
  if (!(this instanceof Profiles)) return new Profiles()
  events.EventEmitter.call(this)
}
util.inherits(Profiles, events.EventEmitter)

Profiles.prototype.beg = function(name) {
  var begin = Date.now()
     , ender
     , self = this

  ender = function() {
    var time = Date.now() - begin
    self.emit('profile', name, time, kTypeTime, uid())
    return time
  }
  return ender
}

Profiles.prototype.stat = function(name, val) {
  this.emit('profile', name, val, kTypeStat, uid())
  return this
}


function ProfilesStream (profiles, endAfter) {
  if (!(this instanceof ProfilesStream)) return new ProfilesStream(profiles, endAfter)
  if (!profiles || !(profiles instanceof Profiles)) throw new Error('need a profiles object to create a ProfilesStream')

  var emitFunc = this.emitShit.bind(this)
    , self = this

  Stream.call(this)
  self.readable = true
  self.writable = false
  self.paused = true
  self.buffers = []
  self.filters = []
  self._alreadyEnded = false

  profiles.on('profile', emitFunc)
  process.nextTick(function() { //wait until nextTick to begin emitting data
    self.resume()
  })

  function end() {
    if (self._alreadyEnded) return
    self._alreadyEnded = true
    profiles.removeListener('profile', emitFunc)
    self.emit('end')
    delete self.buffers
    delete self.filters
  }
  self.once('error', end)
  if (endAfter) {
    setTimeout(end, endAfter)
  }
}
util.inherits(ProfilesStream, Stream)

ProfilesStream.prototype.filter = function() {
  this.filters = this.filters.concat(Array.prototype.slice.apply(arguments))

  return this
}

ProfilesStream.prototype.emitShit = function(name, time, type, uid) {
  if (this.filters.length && this.filters.indexOf(name) === -1) return

  var emitObj = {
    name : name
    , val : time
    , __profileType : type
    , __uid : uid
  }
  emitObj = new Buffer(JSON.stringify(emitObj) + '\n', 'utf8')

  if (this.paused) {
    this.buffers.push(emitObj)
  } else {
    this.emit('data', emitObj)
  }
}

ProfilesStream.prototype.pause = function() {
  this.paused = true
  //console.log('paused')
}

ProfilesStream.prototype.resume = function() {
  var i
  this.paused = false
  for (i = 0; i < this.buffers.length && this.paused === false; i++) {
    this.emit('data', this.buffers[i])
  }
  //note, if we are paused again during a resume, we will maintain our place in unloading buffers.
  //if we don't get re-paused, slicing @ buffers.length will return an empty array
  this.buffers = this.buffers.slice(i)
}


module.exports = Profiles
module.exports.Profiles = Profiles
module.exports.ProfilesStream = ProfilesStream
module.exports.PS = ProfilesStream



