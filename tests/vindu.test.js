const { ok } = require('assert')
const vindu = require('../index.js')
const db = require('configdb')

async function run() {
  // Set up orb
  const $ = {
    req: {},
    res: {},
    db
  }

  // It should not throttle without ip address
  let shouldThrottle = await vindu($, { limit: 1 })
  ok(shouldThrottle === false)

  // Add missing IP
  $.req.ip = '127.0.0.1'

  // It should not throttle on first request
  shouldThrottle = await vindu($, { limit: 1 })
  ok(shouldThrottle === false)

  data = db('request').get({ id: $.req.ip })
  ok(data.n === 1)
  ok(!!data.date)

  // It should not throttle
  shouldThrottle = await vindu($, { limit: 1 })
  ok(shouldThrottle === false)

  data = db('request').get({ id: $.req.ip })
  ok(data.n === 2)
  ok(!!data.date)

  // It should throttle
  shouldThrottle = await vindu($, { limit: 1 })
  ok(shouldThrottle === true)

  data = db('request').get({ id: $.req.ip })
  ok(data.n === 2)
  ok(!!data.date)

  console.log('All tests passed.')

  process.exit(0)
}

run()
