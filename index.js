var util = require('./lib/util.js')

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
    minute: async function (value = 1) {
      return count(util.ago(value, 'minute'))
    },
    hour: async function (value = 1) {
      return count(util.ago(value, 'hour'))
    },
    day: async function (value = 1) {
      return count(util.ago(value, 'day'))
    },
    month: async function (value = 1) {
      return count(util.ago(value * 30, 'day'))
    },
    year: async function (value = 1) {
      return count(util.ago(value * 30 * 12, 'day'))
    },
    total: async function () {
      return count()
    }
  }
}
