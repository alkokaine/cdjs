<template>
  <cd-list class="cd-month" listclass="cd-weekdays" :rowclass="resolverowclass" :collection="weekdays" keyfield="id">
    <cd-list class="cd-weekday--list" slot-scope="weekday" listclass="cd-weekday--days" :class="weekday.row.class" rowclass="cd-day--container" :collection="weekdaylist(weekday)" keyfield="key">
      <div class="cd-weekday--name" slot="header">
        {{ weekday.row.name }}
      </div>
      <div class="cd-day" slot-scope="day" :class="[{ 'cd-day--prev-month': isprevmonth(day), 'cd-holiday': day.row.code === 1 }]">
        <div class="cd-day--header">
          <span class="cd-day--number">{{ day.row.day }}</span>
          <span class="cd-day--info">
            <div>{{ day.row.month_name }}</div>
            <div>{{ day.row.weekday }}</div>
          </span>
        </div>
        <div class="cd-day--content">
          <slot :day="day.row"></slot>
        </div>
      </div>
    </cd-list>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
import moment from 'moment'

const weekdays = [
  {
    id: 1,
    name: 'Понедельник',
    short_name: 'ПН'
  },
  {
    id: 2,
    name: 'Вторник',
    short_name: 'ВТ'
  },
  {
    id: 3,
    name: 'Среда',
    short_name: 'СР'
  },
  {
    id: 4,
    name: 'Четверг',
    short_name: 'ЧТ'
  },
  {
    id: 5,
    name: 'Пятница',
    short_name: 'ПТ'
  },
  {
    id: 6,
    name: 'Суббота',
    short_name: 'СБ',
    class: 'cd-weekend'
  },
  {
    id: 0,
    name: 'Воскресенье',
    short_name: 'ВС',
    class: 'cd-weekend'
  }]
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' })
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' })
const day = (date, code) => ({
  day: dayFormatter.format(date),
  weekdayNumber: date.getDay(),
  weekday: weekdayFormatter.format(date),
  month: date.getMonth(),
  month_name: monthFormatter.format(date),
  code: code
})
const daysInMonth = (year, month) => (moment(`${year}-${month}`, 'YYYY-MM')).daysInMonth()
const date = (year, month, day) => (moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'))

export default {
  name: 'cd-month',
  components: {
    'cd-list': CDList
  },
  props: {
    payload: {
      type: Object,
      validator (value) {
        var hasmonth = true
        var hasyear = true
        if (!Object.prototype.hasOwnProperty.call(value, 'MonthID')) {
          hasmonth = false
          console.error('[CDJS]payload object must have \'MonthID\' property')
        }
        if (!Object.prototype.hasOwnProperty.call(value, 'Year')) {
          hasyear = false
          console.error('[CDJS]payload object must have \'Year\' property')
        }
        if (!(hasmonth && hasyear)) return false
        const monthvalue = value.MonthID
        const ismonth = Number.isInteger(monthvalue) && (monthvalue >= 1 && monthvalue <= 12)
        if (!ismonth) console.error('[CDJS]payload.MonthID value must be Number and starting from 1, ending by 12')
        const yearvalue = value.Year
        const isyear = yearvalue !== undefined && yearvalue !== null && Number.isInteger(yearvalue)
        return ismonth && isyear
      }
    },
    schedule: { type: Array, default: () => ([]) },
    showothers: { type: Boolean, default: true },
    resolvedayclass: { type: Function, default: () => ('') }
  },
  data (cdm) {
    return {
      weekdays: weekdays,
      keyfield: 'key',
      dates: []
    }
  },
  watch: {
    payload: {
      deep: true,
      immediate: true,
      handler (newvalue) {
        const calendar = this
        let _days = []
        if (newvalue !== undefined && newvalue.Year !== undefined && newvalue.MonthID !== undefined) {
          calendar.$http.get(`https://isdayoff.ru/api/getdata?year=${newvalue.Year}&month=${(newvalue.MonthID)}&pre=1&covid=1&sd=0`)
            .then((response) => {
              _days = Array.from(response.request.response).map(m => Number(m))
            }).catch((error) => {
              console.error(error)
            }).finally(() => {
              const prepend = (days) => {
                const first = days[0]
                const fd = date(newvalue.Year, newvalue.MonthID, first.day)
                if (first.weekdayNumber === 1) return days
                const result = []
                let ln = first.weekdayNumber - 1
                while (ln > 0) {
                  result.unshift(day(fd.subtract(1, 'days').toDate()))
                  ln -= 1
                }
                return result.concat(days)
              }
              const dayscount = daysInMonth(newvalue.Year, newvalue.MonthID)
              _days = (_days.length > 0
                ? _days.map((_d, index) => ({ code: _d, d: index + 1 }))
                : Array.from(Array(dayscount).keys()).map((_d, index) => ({ d: index + 1 })))
                .map(d => (day(date(newvalue.Year, newvalue.MonthID, d.d).toDate(), d.code)))
              calendar.dates = prepend(_days)
            })
        }
      }
    }
  },
  computed: {
    weekdaylist () {
      const calendar = this
      return (weekday) => calendar.dates.filter(d => d.weekdayNumber === weekday.row.id)
    },
    isprevmonth () {
      const calendar = this
      return (weekday) => weekday.row.month !== (calendar.payload.MonthID - 1)
    }
  },
  methods: {
    resolverowclass (row) {
      const cdmonth = this
      return `cd-weekday-container ${([0, 6].indexOf(row.weekdayNumber) !== -1 ? 'cd-day--weekend' : '')} ${cdmonth.resolvedayclass(row)}`
    }
  }
}
</script>

<style>
  .cd-day--container {
      padding: 5px;
      border: 1px solid;
      border-radius: 0.5em;
      border-color: rgba(0, 0, 0, 0.205);
      margin-bottom: 5px;
      min-height: 125px;
  }
  .cd-days--list {
    list-style: none;
    margin: 0 0 0 0;
    padding: 0;
  }
  .cd-day--info {
    line-height: 1;
  }
  .cd-days--list > li {
    width: 14%;
  }
  .cd-day--header {
    display: flex;
    text-align: right;
    justify-content: space-around;
    align-items: center;
  }
  .cd-day--number {
    font-size: 2em;
    font-weight: bold;
  }
  .cd-weekdays {
    list-style: none;
    width: 100%;
    padding-inline-start: unset;
    display: inline-flex;
    justify-content: space-between;
  }
  .cd-weekday-container {
    width: 14%;
  }
  .cd-weekend {
    color: salmon;
  }
  .cd-holiday {
    color: salmon;
  }
  .cd-weekday--days {
    list-style: none;
    padding-inline-start: unset;
  }
  .cd-day--content {
    border-top: 1px solid;
    color: black;
  }
  .cd-day--prev-month {
    opacity: 0.5;
  }
</style>
