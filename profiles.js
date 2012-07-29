
function createProfiler() {
  var times = {} 
    , me = {}

  function begArr(name) {
    return times['beg_'+name]
  }
  function endArr(name) {
    return times['end_'+name]
  }
  me.begArr = begArr
  me.endArr = endArr

  me.beg = function(name) {
    var beg = begArr(name)
      , end
    if (!beg) {
      beg = []
      end = []
      times['beg_'+name] = beg
      times['end_'+name] = end
      Object.defineProperty(me, name, {
        get : function() {
          var i = end.length-1
          return end[i] - beg[i]
        }
      })
    }

    beg.push(Date.now())
    return this
  }

  me.end = function(name) {
    var d = Date.now()
       , end = endArr(name)
       , beg = begArr(name)
    end.push(d)
    return me[name] //accessor method
  }

  me.reduce = function(name) {
    var totals = []
      , beg = begArr(name)
      , end = endArr(name)
      , i 
    for (i = 0; i < end.length; i++) {
      totals[i] = end[i] - beg[i]
    }
    return totals
  }

  me.times = function(name) {
    return [ begArr(name), endArr(name) ]
  }

  return me
}

module.exports = createProfiler
