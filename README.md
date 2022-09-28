# Vindu

Rate limiter for APIs.

### Install

```sh
npm i vindu
```

### Usage

```
const vindu = require('vindu')

const $ = { req, res, db }

function rateLimit(res) {
  res.statusCode = 429
  res.end('')
}

const result = await vindu($)
if (result.throttle) {
  return rateLimit(res)
}
```

MIT Licensed. Enjoy!
