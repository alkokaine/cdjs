import moment from 'moment'
moment.updateLocale('ru', { week: { dow: 1 } })
const createDate = (year, month, day) => (moment(`${year}-${month}-${day}`, 'YYYY-MM-DD', 'ru'))
const lastMonthDay = (date) => {
  return date.subtract(1, 'months').set('date', date.daysInMonth())
}
const prevMonthDays = (date) => {
  const lastDay = lastMonthDay(moment(date.toISOString(true)))
  const days = []
  while (lastDay.day() > 0) {
    days.unshift({ date: moment(lastDay.toISOString(true)), isprev: true })
    lastDay.subtract(1, 'days')
  }
  return days
}
const prevMonthWeekLength = (date) => {
  const prev = (moment(date)).subtract(1, 'month')
  return (lastMonthDay(prev.year(), prev.month())).day()
}
const weekdays = (
  [1, 2, 3, 4, 5, 6, 7]
    .map(d => ({
      weekday: {
        short: moment().isoWeekday(d).format('dd'),
        long: moment().isoWeekday(d).format('dddd')
      },
      order: d,
      day: d % 7
    })
    ))

const weekDescriptor = compact => weekdays.map(m => ({
  datafield: m.weekday.long,
  text: compact ? m.weekday.short : m.weekday.long,
  day: m.day,
  tdclass: ['weekday-cell', { compact: compact }],
  headerclass: 'text-center text-uppercase'
}))

function getMonthDays (moment) {
  const daysInMonth = Array(moment.daysInMonth()).keys()
  const arrayFromKeys = Array.from(daysInMonth)
  const result = arrayFromKeys.map((m) => (createDate(moment.year(), moment.month() + 1, m + 1))).map(date => ({ day: date.day(), month: date.month(), number: date.date(), date: date.toISOString(true) }))
  return result
}

export {
  createDate,
  prevMonthDays,
  prevMonthWeekLength,
  weekdays,
  getMonthDays,
  weekDescriptor
}
