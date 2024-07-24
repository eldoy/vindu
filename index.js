var ago = require('./lib/ago.js')

module.exports = async function ($, opt = {}) {
  var key = opt.key || $.req?.ip
  var collection = opt.collection || 'request'

  var request = await $.db(collection).create({ key })

  async function count(since) {
    if (!key) return 0
    var query = { id: { $lte: request.id }, key }
    if (since) {
      query.created_at = { $gte: since }
    }
    return $.db(collection).count(query)
  }

  return {
    minute: function (value = 1) {
      return count(ago(value, 'minute'))
    },
    hour: function (value = 1) {
      return count(ago(value, 'hour'))
    },
    day: function (value = 1) {
      return count(ago(value, 'day'))
    },
    month: function (value = 1) {
      return count(ago(value * 30, 'day'))
    },
    year: function (value = 1) {
      return count(ago(value * 30 * 12, 'day'))
    },
    total: function () {
      return count()
    }
  }
}
