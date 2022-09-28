const LIMIT = 30 // requests per minute

module.exports = async function ($, opt = {}) {
  if (typeof opt.limit == 'undefined') {
    opt.limit = LIMIT
  }

  if (!opt.collection) {
    opt.collection = 'request'
  }

  // Check ip address and fetch record in database
  const ip = $.req.ip
  console.log({ ip })
  if (!ip) return false

  async function update(values) {
    await $.db(opt.collection).update({ id: ip }, values)
  }

  let data = await $.db(opt.collection).get({ id: ip })
  if (data) {
    // Check if we did more than limit
    const oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000)

    // Check last updated_at is more than a second ago
    const withinWindow = data.updated_at.getTime() > oneMinuteAgo

    if (withinWindow) {
      if (data.n > opt.limit) {
        await update({ updated_at: new Date() })
        return true
      } else {
        await update({ n: data.n + 1, updated_at: new Date() })
      }
    } else {
      await update({ n: 1, updated_at: new Date() })
    }
  } else {
    await $.db(opt.collection).create({ id: ip, n: 1, updated_at: new Date() })
  }
  return false
}
