var mongowave = require('mongowave')
var vindu = require('../index.js')

module.exports = async function () {
  var db = await mongowave('vindu-test')

  var $ = { vindu, db, req: {} }

  return { $ }
}
