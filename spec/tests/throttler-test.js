setup(async function ({ $ }) {
  $.req = {}
  await $.db('request').delete()
})

it('should not throttle without ip address', async ({ t, $ }) => {
  var result = await $.throttler($, { limit: 1 })
  t.equal(result, false)

  var count = await $.db('request').count()
  t.equal(count, 1)

  result = await $.throttler($, { limit: 1 })
  t.equal(result, false)

  count = await $.db('request').count()
  t.equal(count, 2)
})

it('should throttle with ip address', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await $.throttler($, { limit: 1 })
  t.ok(result === false)

  var count = await $.db('request').count({ key: $.req.ip })
  t.equal(count, 1)

  result = await $.throttler($, { limit: 1 })
  t.equal(result, true)

  count = await $.db('request').count({ key: $.req.ip })
  t.equal(count, 2)
})

it('should not throttle if concurrency < limit', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await Promise.all(
    Array(3)
      .fill(0)
      .map(async () => $.throttler($, { limit: 5 }))
  )

  t.deepStrictEqual(result, Array(3).fill(false))

  var count = await $.db('request').count({ key: $.req.ip })
  t.equal(count, 3)
})

it('should not throttle if concurrency == limit', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await Promise.all(
    Array(5)
      .fill(0)
      .map(async () => $.throttler($, { limit: 5 }))
  )

  t.deepStrictEqual(result, Array(5).fill(false))

  var count = await $.db('request').count({ key: $.req.ip })
  t.equal(count, 5)
})

it('should throttle if concurrency > limit', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await Promise.all(
    Array(8)
      .fill(0)
      .map(async () => $.throttler($, { limit: 5 }))
  )

  t.equal(result.length, 8)

  var allowed = result.filter((r) => r == false)
  var blocked = result.filter((r) => r == true)

  t.equal(allowed.length, 5)
  t.equal(blocked.length, 3)

  var count = await $.db('request').count({ key: $.req.ip })
  t.equal(count, 8)
})
