setup(async function ({ $ }) {
  await $.db('request').delete()
})

it('should not throttle without ip address', async ({ t, $ }) => {
  var result = await $.vindu($, { limit: 1 })
  t.equal(result, false)

  var count = await $.db('request').count()
  t.equal(count, 0)

  result = await $.vindu($, { limit: 1 })
  t.equal(result, false)

  count = await $.db('request').count()
  t.equal(count, 0)
})

it('should throttle with ip address', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await $.vindu($, { limit: 1 })
  t.ok(result === false)

  var count = await $.db('request').count({ ip: $.req.ip })
  t.equal(count, 1)

  // should throttle
  result = await $.vindu($, { limit: 1 })
  t.equal(result, true)

  count = await $.db('request').count({ ip: $.req.ip })
  t.equal(count, 2)
})

it('concurrency lower than limit should not throttle', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await Promise.all(
    Array(3)
      .fill(0)
      .map(async () => $.vindu($, { limit: 5 }))
  )

  t.deepStrictEqual(result, Array(3).fill(false))
})

it('concurrency equal to limit should not throttle', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await Promise.all(
    Array(5)
      .fill(0)
      .map(async () => $.vindu($, { limit: 5 }))
  )

  t.deepStrictEqual(result, Array(5).fill(false))
})

it('concurrency greater than limit should throttle', async ({ t, $ }) => {
  $.req.ip = '127.0.0.1'

  var result = await Promise.all(
    Array(8)
      .fill(0)
      .map(async () => $.vindu($, { limit: 5 }))
  )

  t.equal(result.length, 8)

  var allowed = result.filter((r) => r == false)
  var blocked = result.filter((r) => r == true)

  t.equal(allowed.length, 5)
  t.equal(blocked.length, 3)
})
