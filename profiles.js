
var util = require('util')
  , events = require('events')
  , Stream = require('stream')

function Profiles () {
  if (!(this instanceof Profiles)) return new Profiles()
  events.EventEmitter.call(this)
  this.profiles = {}
  this.stats = {}
}
util.inherits(Profiles, events.EventEmitter)


Profiles.prototype.begArr = function begArr(name) {
  return this.profiles['__beg_'+name]
}

Profiles.prototype.endArr = function endArr(name) {
  return this.profiles['__end_'+name]
}

Profiles.prototype.beg = function(name) {
  var beg = this.begArr(name)
    , end
  if (!beg) {
    beg = []
    end = []
    this.profiles['__beg_'+name] = beg
    this.profiles['__end_'+name] = end
    Object.defineProperty(this, name, {
      get : function() {
        var i = end.length-1
        return end[i] - beg[i]
      }
    })
  }

  beg.push(Date.now())
  return this
}

Profiles.prototype.end = function(name) {
  var d = Date.now()
     , end = this.endArr(name)
     , beg = this.begArr(name)
     , time
  end.push(d)
  time = this[name]
  this.emit('profile', name, time)
  return time
}

Profiles.prototype.stat = function(name, val) {
  if (Array.isArray(this.stats[name])) this.stats[name].push(val)
  else this.stats[name] = [ val ] //TODO: should I define a property--getter?
  this.emit('profile', name, val) 
  return val
}

Profiles.prototype.compact = function(name) {
  var totals = []
    , beg = this.begArr(name)
    , end = this.endArr(name)
    , i 
  for (i = 0; i < end.length; i++) {
    totals[i] = end[i] - beg[i]
  }
  return totals
}

Profiles.prototype.times = function(name) {
  return [ this.begArr(name), this.endArr(name) ]
}



function ProfilesStream (profiles) {
  if (!(this instanceof ProfilesStream)) return new ProfilesStream(profiles)
  if (!profiles || !(profiles instanceof Profiles)) throw new Error('need a profiles object to create a ProfilesStream')

  Stream.call(this)
  this.readable = true  
  this.writable = false
  this.paused = false
  this.buffers = []

  profiles.on('profile', this.emitShit.bind(this))
}
util.inherits(ProfilesStream, Stream)

ProfilesStream.prototype.emitShit = function(name, time) {
  var emitObj = {'name' : name, 'val' : time}
  emitObj = new Buffer(JSON.stringify(emitObj), 'utf8')
  
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
  //note, if we are paused again during a resume, we will maintain our place. If we aren't paused, slicing buffers.length will return an empty array
  this.buffers = this.buffers.slice(i)
}


module.exports = Profiles
module.exports.Profiles = Profiles
module.exports.ProfilesStream = ProfilesStream



