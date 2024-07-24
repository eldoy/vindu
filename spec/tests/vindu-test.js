var vindu = require('../../index.js')
var { sleep } = require('extras')

var $ = {}

setup(async function ({ $ }) {
  $.req = { ip: '127.0.0.1', query: {}, params: {}, headers: {} }
  await $.db('request').delete()
  await $.db('request-cache').delete()
})

it('should count and cache', async ({ t, $ }) => {
  var { minute, month, year } = await vindu($)

  t.equal(minute, 1)
  t.equal(month, 1)
  t.equal(year, 1)

  await sleep(0.3)

  var requestCount = await $.db('request').count()
  var cacheCount = await $.db('request-cache').count()

  t.equal(requestCount, 1)
  t.equal(cacheCount, 1)

  var request = await $.db('request').get()

  t.ok(!!request.key)
  t.ok(!!request.query)
  t.ok(!!request.params)
  t.ok(!!request.headers)

  var cache = await $.db('request-cache').get()
  t.equal(cache.minute, 1)
  t.equal(cache.month, 1)
  t.equal(cache.year, 1)
})
