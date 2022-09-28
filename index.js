const LIMIT = 30 // requests per minute

module.exports = async function ($, opt = {}) {
  if (typeof opt.limit == 'undefined') {
    opt.limit = LIMIT
  }

  if (!opt.collection) {
    opt.collection = 'request'
  }

  // Check ip address and fetch record in docbase
  const ip = $.req.ip
  if (!ip) return false

  async function update(values = {}) {
    values.date = new Date()
    await $.db(opt.collection).update({ id: ip }, values)
  }

  let doc = await $.db(opt.collection).get({ id: ip })
  if (!doc) {
    await $.db(opt.collection).create({ id: ip, n: 1, date: new Date() })
  } else {
    // Check if we did more than limit
    const oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000)

    // Check last date is more than a second ago
    const withinWindow = doc.date.getTime() > oneMinuteAgo

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
