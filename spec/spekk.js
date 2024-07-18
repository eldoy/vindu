var mongowave = require('mongowave')
var vindu = require('../index.js')

var _Date = Date
Object.getOwnPropertyNames(Date).forEach(function (name) {
  _Date[name] = Date[name]
})

function mockDate(date = new Date()) {
  Date = function () {
    return new _Date(date)
  }

  Object.getOwnPropertyNames(_Date).forEach(function (name) {
    Date[name] = _Date[name]
  })
}

function resetDate() {
  Date = _Date
}

module.exports = async function () {
  var db = await mongowave('vindu-test')

  async function throttler($, opts = {}) {
    var limit = opts.limit || 30
    var { minute } = await vindu($, opts)
    var requestsLastMinute = await minute()
    return requestsLastMinute > limit
  }

  function after() {
    resetDate()
  }

  var $ = { vindu, throttler, db, mockDate, resetDate }

  return { $, after }
}
