<template>
  <div class="cd-month--wrapper">
    <slot name="month-header" :mdate="mdate" :days="keyedDays" :selectDay="onDaySelect">
      <div class="text-nowrap p-2 fs-5 month-nav mx-auto">
        <button v-if="showControls" class="btn bi bi-arrow-left ms-3" v-on:click="setMonth(1)"/>
        <span class="w-100">{{ mdate | month }}</span>
        <button v-if="showControls" class="btn bi bi-arrow-right me-3" v-on:click="setMonth(-1)"/>
      </div>
    </slot>
    <slot name="commands"></slot>
    <div class="schedule-wrapper position-relative">
      <div class="month-schedule--wrap position-absolute w-100">
        <slot name="scheduler" :current="totalSelected" :date="mdate"></slot>
      </div>
    </div>
    <template v-if="ischedule">
      <cd-day-grid class="cd-month mx-auto" :compact="compact" :week-range="weekRange" :days="keyedDays" :compare-date="compareDate"
        :select-weekdays="selectWeekdays" :selected-days="totalSelected" :keyed-days="keyedDays" :date="calendarDate">
        <template slot-scope="{ day, week }" >
          <slot :day="day" :week="week" :isSelected="isDaySelected(day)">
            <cd-day :info="day" :compact="compact" v-on:click.native="onDaySelect($event, day, week)" :is-selected="isDaySelected(day)">
              <div slot="header" class="cd-day--header">
                <button class="btn btn-link text-decoration-none bi" v-on:click.capture.stop="removeDay($event, day)"
                  :class="{ 'd-none': compact, 'bi-x-square text-light': isDaySelected(day) }"></button>
              </div>
              <template v-if="!compact">
                <div class="day-content text-pre">
                  <slot :day="day" :week="week"></slot>
                </div>
              </template>
            </cd-day>
          </slot>
        </template>
      </cd-day-grid>
    </template>
    <template v-else>
      <cd-day-tabs class="cd-month" :days="keyedDays" :orientation="orientation" :compare-date="compareDate" :multiple="multiple" 
        :selected-days="totalSelected" :day-class="resolveTabClass" :date="calendarDate" :hide-tabs="hideTabs">
        <button v-if="!hideTabs" slot="icon" slot-scope="{ day }" class="btn btn-link btn-sm" v-on:click="removeDay($event, day)" 
          :class="{ 'bi-check-square-fill': isDaySelected(day) }"></button>
        <template slot-scope="{ day }">
          <slot :day="day" :isSelected="isDaySelected(day)">
            <cd-day :info="day" :is-selected="isDaySelected(day)" v-on:click.native="onDaySelect($event, day)">
              <slot name="header" :day="day"></slot>
              <div class="day-content text-pre">
                <slot :day="day"></slot>
              </div>
            </cd-day>
          </slot>
        </template>
      </cd-day-tabs>
    </template>
    <slot name="month-footer" :selected="innerSelected"></slot>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { createDate, prevMonthDays } from '../common/month-days'
import utils from '../common/utils'
import CDDayGrid from './cd-day-grid.vue'
import CDDayTab from './cd-day-tabs.vue'
import CDDay from './cd-day.vue'

const formatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric'})
const compareDate = function ({ date }, day) {
      return date.getDate() === day.getDate() &&
        date.getMonth() === day.getMonth() &&
        date.getFullYear() === day.getFullYear()
    }

export default {
  name: 'cd-month',
  components: {
    'cd-day-grid': CDDayGrid,
    'cd-day-tabs': CDDayTab,
    'cd-day': CDDay,
  },
  props: {
    template: { type: Function },
    hideTabs: { type: Boolean },
    goPrev: { type: Function, default: (day) => console.log(day) },
    mode: {
      type: String,
      validator (value) {
        return ['list', 'schedule'].indexOf(value) !== -1
      },
      default: 'schedule',
      description: 'Режим календаря, schedule (по умолчанию) -- месяц разбит по неделям; list -- дни идут списком'
    },
    compareDate: { type: Function, description: 'функция возвращает true, если даты параметров функции совпадают', default: compareDate },
    sixDays: { type: Boolean, default: false, description: 'Признак шестидневной рабочей недели' },
    prependDays: { type: Boolean, default: true, description: 'Если месяц начинается не с понедельника и prepend-days = true, то присоединим дни из предыдущего месяца так, чтобы первое число указанного месяца было в своей клетке дня недели' },
    compact: { type: Boolean, default: false, description: 'Компактный режим' },
    selectWeekdays: { type: Boolean, default: false, description: 'Режим выбора дня недели (появится чекбокс)' },
    onWeekdaySelect: { type: Function, description: 'Функция, которую выполним по выбору дня недели' },
    orientation: { type: String, description: 'Расположение ярлыков на дни месяца' },
    multiple: { type: Boolean, default: false, description: 'Можно ли выбрать несколько дней' },
    date: { type: [Date, String, Number] },
    selectedDays: { type: Array },
    showControls: { type: Boolean }
  },
  data ({ date, mdate }) {
    return {
      empty: undefined,
      selector: {},
      isLoading: false,
      isSchedule: false,
      selectedWeekdays: [],
      mdate: date,
      selected: [],
      editEvent: Object,
      calendarDays: Array,
    }
  },
  watch: {
    $axios: {
      handler (newvalue) {
        newvalue.then(response => console.log(response)).catch(error => console.error(error))
      }
    }
  },
  methods: {
    setDate (moment) {
      this.mdate = moment.toDate()
    },
    setSchedule($event, value) {
      this.isSchedule = value
      if (!value) this.selector = {}
    },
    setDays (days) {
      this.calendarDays = days
    }
  },
  computed: {
    setMonth ({ setDate, mdate }) {
      return (inc) => {
        setDate(moment(mdate).subtract(inc, 'month'))
      }
    },
    totalSelected ({ selectedDays, templateSelected, selected }) {
      return (selectedDays || []).concat(templateSelected).concat((selected || []))
    },
    innerSelected ({ templateSelected, selected }) {
      return templateSelected.concat(selected)
    },
    templateSelected ({ template, calendarDays }) {
      return template == undefined ? [] : calendarDays.filter(template)
    },
    submitSchedule ({ setSchedule }) {
      return (...args) => {

        setSchedule({}, false)
      }
    },
    resetSchedule ({ setSchedule }) {
      return (...args) => {
        setSchedule({}, false)
      }
    },
    resolveTabClass ({ isDaySelected }) {
      return ( tab ) => {
        return [ 'cd-month-tab-day', isDaySelected(tab) ? 'cd-day-tab-selected': 'cd-day-tab' ]
      }
    },
    removeDay ({ selected }) {
      return ($event, { daykey }) => {
        const index = selected.findIndex(d => d.daykey == daykey)
        if (index >= 0) selected.splice(index, 1)
      }
    },
    selectedLength ({ totalSelected }) {
      return totalSelected.length
    },
    selectDay ({ selected, multiple, removeDay, compact }) {
      return function ($event, day) {
        debugger
        const findIndex = selected.findIndex(d => d.daykey === day.daykey)
          if (findIndex < 0) {
            if (multiple) {
              selected.push(day)
            } else {
              if (selected.length == 0) {
                selected.push(day)
              } else {
                selected.splice(findIndex, 1, day)
              }
            }
          } else {
            if (compact) removeDay($event, day)
          }
      }
    },
    onDaySelect ({ goPrev, empty, isDaySelected, selectDay, removeDay, $nextTick }) {
      return ($event, day, week) => {
        debugger
        if (day == empty) {
          const entries = Object.entries(week).map(m => m[1]).filter(f => f != empty && f.date != empty && f.isprev == empty)
          if ($event.target.classList.contains('bi-check-square-fill')) {
            entries.forEach(d => $nextTick().then(() => removeDay($event, d)))
          } else {
            entries.filter(f => !isDaySelected(f)).forEach(d => $nextTick().then(() => selectDay($event, d)))
          } 
        } else if (day.isprev) {
            goPrev(day)
          }  else {
            if (isDaySelected(day)) removeDay($event, day)
            else selectDay($event, day)
          }
      }
    },
    calendarDate ({ mdate }) {
      const _date = new Date(mdate)
      return createDate(_date.getFullYear(), _date.getMonth() + 1, _date.getDate())
    },
    offConfig ({ calendarDate, sixDays }) {
      return {
        url: 'https://isdayoff.ru/api/getdata',
        method: 'get',
        params: {
          year: calendarDate.year(),
          month: calendarDate.month() + 1,
          pre: 1,
          sd: sixDays == true ? 1 : 0
        }
      }
    },
    ischedule ({ mode }) {
      return mode === 'schedule'
    },
    days ({ calendarDate, prependDays, setDays }) {
      return ({ request }) => setDays((prependDays ? prevMonthDays(calendarDate) : [])
        .concat(
          Array.from(Array(calendarDate.daysInMonth()).keys())
            .map((d, i) => ({ date: createDate(calendarDate.year(), calendarDate.month() + 1, d + 1), code: request.response[i] }))
        ))
    },
    $axios ({ days , offConfig }) {
      const state = this
      const axiosInstance = axios.create()
      axiosInstance.interceptors.request.use(config => {
        state.$nextTick().then(() => {
          state.isLoading = true
        })
        return config
      })
      axiosInstance.interceptors.response.use(response => {
        setTimeout(() => {
          state.isLoading = false
        }, 100)
        return response
      }, error => {
        setTimeout(() => {
          state.isloading = false
          state.error = error
        }, 100)
      })
      return axiosInstance(offConfig).then(response => days(response)).catch(error => errorRequest(error))
    },
    weekNumbers ({ calendarDays }) {
      const _map = typeof calendarDays == 'function' ? [] : calendarDays
      return _map.map(d => d.date.week())
    },
    keyedDays ({ calendarDays }) {
      const _map = typeof calendarDays == 'function' ? [] : calendarDays
      return _map.map(m => ({ isprev: m.isprev, date: m.date, daykey: m.date.unix(), code: m.code }))
    },
    minWeekNumber ({ weekNumbers }) {
      return Math.min(...weekNumbers)
    },
    maxWeekNumber ({ weekNumbers }) {
      return Math.max(...weekNumbers)
    },
    weekRange ({ minWeekNumber, maxWeekNumber, weekNumbers }) {
      return utils.range(minWeekNumber, maxWeekNumber, 1).filter(w => weekNumbers.indexOf(w) !== -1)
    },

    checkboxid () {
      return ({ day }) => `wd_${day}`
    },
    isChecked ({ selectedWeekdays }) {
      return (row) => {
        return selectedWeekdays.indexOf(row.day) >= 0
      }
    },
    weekdayClass ({ selectedWeekdays, sixDays }) {
      return (weekday, index) => {
        // const isselected = selectedWeekdays.indexOf(weekday.day) >= 0
        if ((index === 5 && !sixDays) || index === 6) return 'holiday'
        return [`weekday-${weekday.info.long.toLowerCase()}s`, {
          'is-selected': selectedWeekdays.indexOf(weekday.day) >= 0,
          holiday: (index === 5 && !sixDays) || index === 6
        }]
      }
    },
    isDaySelected ({ totalSelected }) {
      return ({ date }) => {
        return (totalSelected.findIndex(d => {
          return ((d.date.date() === date.date() && d.date.month() === date.month()) )
        }) >= 0)
      }
    }
  },
  filters: {
    month (value) {
      return formatter.format(new Date(value))
    }
  }
}
</script>

<style>
  .mw-mc {
    max-width: min-content;
  }
  .cd-weekday--container {
    max-width: 14%;
  }
  .holiday {
    color: red;
  }
  .cd-month--wrapper {
  }
  .cd-day.compact {
    /* max-width: 50px; */
  }
  .cd-month.compact {
    width: max-content;
  }
  .cd-grid--start-th
  {
    width: 1px;
  }
  .cd-grid--end-th {
    width: 1px;
  }
  .cd-month--wrapper.scheduler {
    width: min-content!important;
  }
  .scheduler {
    /* z-index: 100; */
  }
  .schedule-calendar--grid {
    /* width: fit-content; */
  }
  .schedule-wrapper {
    width: inherit;
  }
</style>
