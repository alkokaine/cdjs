<template>
  <div class="calendar-container">
    <template v-if="isweekmode">
      <cd-list class="cd-month" listclass="cd-weekdays weeks-view row" :rowclass="resolverowclass" :collection="weekdays" keyfield="id">
        <cd-list class="cd-weekday--list" slot-scope="weekday" listclass="cd-weekday--days" :class="weekday.row.class" rowclass="row cd-day--container" :collection="weekdaylist(weekday)" keyfield="key">
          <div class="cd-weekday--name" slot="header">
            {{ weekday.row.name }}
          </div>
          <template slot-scope="day">
            <slot :day="day.row">
              {{ day }}
            </slot>
          </template>
        </cd-list>
      </cd-list>
    </template>
    <template v-else>
      <cd-list class="cd-month" listclass="cd-weekday--days list-view" rowclass="cd-day--container" :collection="dates" keyfield="key" :isrowvisible="isdayvisible">
        <template slot-scope="day">
          <slot :day="day.row">
            {{ day }}
          </slot>
        </template>
      </cd-list>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
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
        if (!Object.prototype.hasOwnProperty.call(value, 'mode')) {
          Vue.set(value, 'mode', 0) // по умолчанию поставим 0
        }
        if (!(hasmonth && hasyear)) return false
        const monthvalue = value.MonthID
        const ismonth = Number.isInteger(monthvalue) && (monthvalue >= 1 && monthvalue <= 12)
        if (!ismonth) console.error('[CDJS]payload.MonthID value must be Number and starting from 1, ending by 12')
        const yearvalue = value.Year
        const isyear = yearvalue !== undefined && yearvalue !== null && Number.isInteger(yearvalue)
        const modevalue = value.mode
        const ismode = Number.isInteger(modevalue) && [0, 1].indexOf(modevalue) !== -1
        if (!ismode) {
          console.warn('[CDJS]payload.mode property must be Number with value 0 or 1. It will be set to 0 (week mode) now')
          Vue.set(value, 'mode', 0)
        }
        return ismonth && isyear
      }
    },
    schedule: { type: Array },
    isvisible: { type: Function, default: (exist, checking) => (true) },
    showothers: { type: Boolean, default: true },
    resolvedayclass: { type: Function, default: () => ('') }
  },
  data (cdm) {
    return {
      isweekmode: cdm.payload.mode === 0,
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
              // приходит строчка из нулей, единиц, двоек и четвёрок, индекс символа указывает на номер дня (начиная с нуля)
              // а значение -- код дня в производственном календаре
              // для начала переведём строчку в массив нулей, единиц, двоек и четвёрок
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
                if (ln < 0) ln = 6 - ln - 1
                while (ln > 0) {
                  result.unshift(day(fd.subtract(1, 'days').toDate()))
                  ln -= 1
                }
                return result.concat(days)
              }
              const dayscount = daysInMonth(newvalue.Year, newvalue.MonthID)
              _days = (_days.length > 0 // на предыдущем шаге удалось получить проиводственный календарь за этот месяц?
                ? _days.map((_d, index) => ({ code: _d, d: index + 1 })) // отмаппим массив нулей, единиц, двоек и четвёрок в массив обьектов
                // { code: Number (код календарного дня), d: index + 1 (день месяца, человеческий) }
                // если же не получилось с произовдственным календарём
                : Array.from(Array(dayscount).keys()).map((_d, index) => ({ d: index + 1 })))
                .map(d => (day(date(newvalue.Year, newvalue.MonthID, d.d).toDate(), d.code)))
                // и ещё раз отмаппим, через функцию day, которая вернёт всё, что нам нужно знать об этом дне
              if (newvalue.mode === 0) {
                calendar.dates = prepend(_days)
              } else {
                calendar.dates = _days
              }
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
    },
    isdayvisible () {
      const calendar = this
      return (weekday) => {
        if (calendar.schedule === undefined) return true
        if (typeof calendar.schedule === 'function') return true
        return calendar.schedule.findIndex(exists => calendar.isvisible(exists, weekday)) >= 0
      }
    }
  },
  methods: {
    resolverowclass (row) {
      const cdmonth = this
      return `cd-weekday-container col ${([0, 6].indexOf(row.weekdayNumber) !== -1 ? 'cd-day--weekend' : '')} ${cdmonth.resolvedayclass(row)}`
    }
  }
}
</script>

<style>
  .cd-weekday--days {
    padding-inline-start: unset;
    list-style: none;
  }
  .cd-weekdays {
    padding-inline-start: unset;
    list-style: none;
    margin-right: unset;
    margin-left: unset;
  }
  .cd-holiday {
    color: salmon;
  }
  .cd-weekend {
    color: salmon;
  }
  .cd-day--header {
    justify-content: space-between;
    padding-left: 1em;
    padding-right: 1em;
  }
  .cd-day--number {
    font-size: 2em;
    font-weight: bolder;
  }
  .cd-day--container {
    margin-left: 0.5em;
    margin-right: 0.5em;
    flex-grow: 1;
  }
  .cd-day--content {
    border-top: 1px solid;
  }
  .cd-day--info {
    text-align: right;
  }
  .cd-day {
    border: 1px solid;
    border-color: #00000023;
    border-radius: 0.5em;
  }
  .col {
    padding-left: unset;
    padding-right: unset;
  }
</style>
