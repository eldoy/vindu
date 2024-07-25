# Vindu

Rate limiter for APIs.

Made for the [Waveorb Web Application Development Framework](https://waveorb.com).

### Install

```
npm i vindu
```

### Usage

```js
var vindu = require('vindu')

var $ = { req, res, db }

var options = {
  // The key used to identify the API user, default is the request IP
  key: $.req.ip,

  // The name of the database collection to use
  collection: 'request'
}

// Returns the number of requests per minute, month and year
var { minute, month, year } = await vindu($, options)

function rateLimit(res) {
  res.statusCode = 429
  res.end('')
}

var apikey = $.req.params.apikey
var account = await $.db('account').get({ apikey })

if (minute > account.limit) {
  return rateLimit($.res)
}
```

MIT Licensed. Enjoy!

Created by [Eldøy Projects](https://eldoy.com)
