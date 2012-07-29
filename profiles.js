
function createProfiler() {
  var times = {} 
    , me = {}

  me.beg = function(name) {
    var begArr = times['beg_'+name]
      , endArr
    if (!begArr) {
      begArr = []
      endArr = []
      times['beg_'+name] = begArr
      times['end_'+name] = endArr
      Object.defineProperty(me, name, {
        get : function() {
          var i = endArr.length-1
          return endArr[i] - begArr[i]
        }
      })
    }

    begArr.push(Date.now())
    return this
  }

  me.end = function(name) {
    times['end_'+name].push(Date.now())
    return this
  }

  me.reduce = function(name) {
    var totals = []
      , begArr = times['beg_'+name]
      , endArr = times['end_'+name]
      , i 
    for (i = 0; i < endArr.length; i++) {
      totals[i] = endArr[i] - begArr[i]
    }
    return totals
  }

  return me
}

module.exports = createProfiler
