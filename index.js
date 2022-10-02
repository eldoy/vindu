const LIMIT = 30 // requests per minute

module.exports = async function ($, opt = {}) {
  // Return if no db
  if (!$.db) return false

  // Use ip address as id in the database
  const id = opt.id || $.req.ip
  if (!id) return false

  if (typeof opt.limit == 'undefined') {
    opt.limit = LIMIT
  }

  if (!opt.collection) {
    opt.collection = 'request'
  }

  async function update(values = {}) {
    values.date = new Date()
    await $.db(opt.collection).update({ id }, values)
  }

  // Fetch record in database
  const doc = await $.db(opt.collection).get({ id })

  if (!doc) {
    await $.db(opt.collection).create({ id, n: 1, date: new Date() })
  } else {
    // Find the time one minute ago
    const oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000)

    // Check last date is more than a minute ago
    const withinWindow = doc.date.getTime() > oneMinuteAgo

    // Increase counter until limit is reached for the last minute
    if (withinWindow) {
      if (doc.n > opt.limit) {
        await update()
        return true
      } else {
        await update({ n: doc.n + 1 })
      }
    } else {
      await update({ n: 1 })
    }
  }
  return false
}
