module.exports = function ago(value, unit) {
  var date = new Date()

  if (unit == 'minute') {
    date.setTime(date.getTime() - value * 60 * 1000)
  } else if (unit == 'hour') {
    date.setTime(date.getTime() - value * 60 * 60 * 1000)
  } else if (unit == 'day') {
    date.setDate(date.getDate() - value)
  } else if (unit == 'week') {
    date.setDate(date.getDate() - value * 7)
  } else if (unit == 'month') {
    date.setMonth(date.getMonth() - value)
  } else if (unit == 'year') {
    date.setFullYear(date.getFullYear() - value)
  }

  return date
}
