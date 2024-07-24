var ago = require('./ago.js')

module.exports = async function updateCache($, key, collection) {
  var { query, params, headers } = $.req

  var request = await $.db(collection).create({ key, query, params, headers })
  var query = { id: { $lte: request.id }, key }

  async function count(date) {
    query.created_at = { $gte: date }
    return $.db(collection).count(query)
  }

  var [minute, month, year] = await Promise.all([
    count(ago(1, 'minute')),
    count(ago(30, 'day')),
    count(ago(365, 'day'))
  ])

  await $.db(`${collection}-cache`).update({ id: key }, { minute, month, year })

  return { minute, month, year }
}
