var LIMIT = 30 // requests per minute

module.exports = async function ($, opt = {}) {
  // Return if no db
  if (!$.db) return false

  var ip = opt.ip || $.req.ip
  if (!ip) return false

  var limit = opt.limit || LIMIT
  var collection = opt.collection || 'request'

  var request = await $.db(collection).create({ ip })

  var oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000)
  var count = await $.db(collection).count({
    _id: { $lte: request.id },
    ip,
    created_at: { $gte: oneMinuteAgo }
  })

  return count > limit
}
