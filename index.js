var updateCache = require('./lib/updateCache.js')

var fields = ['minute', 'month', 'year']

module.exports = async function vindu($, opt = {}) {
  var key = opt.key || $.req?.ip
  var collection = opt.collection || 'request'

  var coll = $.db(`${collection}-cache`)
  var cached = (await coll.get({ id: key })) || (await coll.create({ id: key }))

  // Happens in background
  updateCache($, key, collection)

  for (var f of fields) cached[f] = (cached[f] || 0) + 1

  return cached
}
