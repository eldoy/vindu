var mongowave = require('mongowave')

module.exports = async function () {
  var db = await mongowave('vindu-test')

  var $ = { db }

  return { $ }
}
