var util = require('../../lib/util.js')

setup(async function ({ $ }) {
  $.req = {}
  await $.db('request').delete()
})

it('should not count without key', async ({ t, $ }) => {
  var throttler = await $.vindu($)

  var result = await Promise.all([
    throttler.minute(),
    throttler.hour(),
    throttler.day(),
    throttler.month(),
    throttler.year(),
    throttler.total()
  ])

  t.deepStrictEqual(result, Array(6).fill(0))

  var count = await $.db('request').count()
  t.equal(count, 1)
})

it('should count with key', async ({ t, $ }) => {
  var throttler = await $.vindu($, { key: '1' })

  var result = await Promise.all([
    throttler.minute(),
    throttler.hour(),
    throttler.day(),
    throttler.month(),
    throttler.year(),
    throttler.total()
  ])

  t.deepStrictEqual(result, Array(6).fill(1))

  var count = await $.db('request').count()
  t.equal(count, 1)
})

it('should count with ip', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var throttler = await $.vindu($)

  var result = await Promise.all([
    throttler.minute(),
    throttler.hour(),
    throttler.day(),
    throttler.month(),
    throttler.year(),
    throttler.total()
  ])

  t.deepStrictEqual(result, Array(6).fill(1))

  var count = await $.db('request').count()
  t.equal(count, 1)
})

it('should count per timeframe', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  // 2 years ago
  $.mockDate(util.ago(2, 'year'))
  var throttler = await $.vindu($)
  $.resetDate()

  var result = await Promise.all([
    throttler.minute(),
    throttler.hour(),
    throttler.day(),
    throttler.month(),
    throttler.year(),
    throttler.total()
  ])

  t.deepStrictEqual(result, [0, 0, 0, 0, 0, 1])

  var count = await $.db('request').count()
  t.equal(count, 1)

  // 5 minutes ago
  $.mockDate(util.ago(5, 'minute'))
  throttler = await $.vindu($)
  $.resetDate()

  result = await Promise.all([
    throttler.minute(),
    throttler.hour(),
    throttler.day(),
    throttler.month(),
    throttler.year(),
    throttler.total()
  ])

  t.deepStrictEqual(result, [0, 1, 1, 1, 1, 2])

  count = await $.db('request').count()
  t.equal(count, 2)

  // now
  throttler = await $.vindu($)

  result = await Promise.all([
    throttler.minute(),
    throttler.hour(),
    throttler.day(),
    throttler.month(),
    throttler.year(),
    throttler.total()
  ])

  t.deepStrictEqual(result, [1, 2, 2, 2, 2, 3])

  result = await throttler.minute(6)
  t.equal(result, 2)

  count = await $.db('request').count()
  t.equal(count, 3)
})
