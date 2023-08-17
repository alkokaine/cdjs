<template>
  <div class="cd-month--wrapper mx-auto">
    <slot name="month-header"></slot>
    <template v-if="ischedule">
      <cd-day-grid class="cd-month" :compact="compact"
        :week-range="weekRange" :days="keyedDays" :compare-date="compareDate"
        :select-weekdays="selectWeekdays" :selected-days="selectedDays" :keyed-days="keyedDays" :select-day="onDaySelect" :date="calendarDate">
        <cd-day slot-scope="{ day, week }" :info="day" :compact="compact" v-on:click.native="onDaySelect($event, day, week)" :is-selected="isDaySelected(day)">
            <div slot="header" class="cd-day--header">
              <button class="btn btn-link text-decoration-none bi" v-on:click.capture.stop="removeDay($event, day)" :class="{ 'd-none': compact, 'bi-x-square text-light': isDaySelected(day) }"></button>
            </div>
            <template v-if="!compact">
              <div class="day-content text-pre">
                <slot :day="day" :week="week"></slot>
              </div>
            </template>
        </cd-day>
      </cd-day-grid>
    </template>
    <template v-else>
      <cd-day-tabs class="cd-month" :days="keyedDays" :select-day="onDaySelect" :orientation="orientation"
        :compare-date="compareDate" :multiple="multiple" :selected-days="selectedDays" :day-class="resolveTabClass"
        :date="calendarDate" :toggle-schedule="setSchedule">
        <div slot="scheduler"  slot-scope="{ month, date }"  class="scheduler position-relative">
          <cd-form v-if="isSchedule" class="scheduler-form border rounded bg-white shadow-lg bg-white opacity-100 p-2 m-2  position-absolute start-50 translate-middle-x"
            :reset="resetSchedule"  :submit="submitSchedule"
            :descriptor="selectorDescriptor" :payload="selector" :showcontrols="true">
              <div slot="header">{{ month || date }}</div>
              <cd-day-grid slot="footer" class="schedule-calendar--grid" :compact="true" :select-day="onDaySelect" :is-selected="isDaySelected" :date="calendarDate"
                :week-range="weekRange" :selected-days="selectedDays" :days="keyedDays" :compare-date="compareDate" :select-weekdays="selectWeekdays" :keyed-days="keyedDays">
              </cd-day-grid>
          </cd-form>
        </div>
        
        <button slot="icon" slot-scope="{ day }" class="btn btn-link btn-sm" 
                  v-on:click="removeDay($event, day)" :class="{ 'bi-check-square-fill': isDaySelected(day) }">
        </button>
        <cd-day slot-scope="{ day }" :info="day" :is-selected="isDaySelected(day)">
          <slot name="header" :day="day"></slot>
          <div class="day-content text-pre">
            <slot :day="day"></slot>
          </div>
        </cd-day>
      </cd-day-tabs>
    </template>
    <slot name="month-footer"></slot>
  </div>
</template>

<script>
import axios from 'axios'
import { createDate, prevMonthDays } from '../common/month-days'
import utils from '../common/utils'
import CDDayGrid from './cd-day-grid.vue'
import CDForm from './cd-form.vue'
import CDDayTab from './cd-day-tabs.vue'
const selectorDescriptor = [
  {
    text: 'Шаблон',
    input: 'select',
    valuekey: 'key',
    labelkey: 'label',
    onselect (payload, option, parent) {
      console.log(option)
      console.log(payload)
    },
    values: [
      {
        function: (date) => {
          console.log(date)
          return false
        },
        key: 1,
        label: 'Все рабочие дни'
      },
      {
        function: (date) => {
          console.log(date)
          return false
        },
        key: 2,
        label: 'Чётные дни месяца'
      },
      {
        function: (date) => {
          console.log(date)
          return false
        },
        key: 3,
        label: 'Нечётные дни месяца'
      },
      {
        function: (date) => {
          console.log(date)
          return false
        },
        key: 4,
        label: 'Чётные дни недели'
      },
      {
        function: (date) => {
          console.log(date)
          return false
        },
        key: 5,
        label: 'Нечётные дни недели'
      }
    ]
  }
]
import CDDay from './cd-day.vue'
const formatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric'})
export default {
  name: 'cd-month',
  components: {
    'cd-day-grid': CDDayGrid,
    'cd-day': CDDay,
    'cd-day-tabs': CDDayTab,
    'cd-form': CDForm
  },
  props: {
    goPrev: { type: Function, default: (day) => console.log(day) },
    mode: {
      type: String,
      validator (value) {
        return ['list', 'schedule'].indexOf(value) !== -1
      },
      default: 'schedule',
      description: 'Режим календаря, schedule (по умолчанию) -- месяц разбит по неделям; list -- дни идут списком'
    },
    compareDate: { type: Function, required: true, description: 'функция возвращает true, если даты параметров функции совпадают' },
    sixDays: { type: Boolean, default: false, description: 'Признак шестидневной рабочей недели' },
    prependDays: { type: Boolean, default: true, description: 'Если месяц начинается не с понедельника и prepend-days = true, то присоединим дни из предыдущего месяца так, чтобы первое число указанного месяца было в своей клетке дня недели' },
    compact: { type: Boolean, default: false, description: 'Компактный режим' },
    selectWeekdays: { type: Boolean, default: false, description: 'Режим выбора дня недели (появится чекбокс)' },
    onWeekdaySelect: { type: Function, description: 'Функция, которую выполним по выбору дня недели' },
    orientation: { type: String, description: 'Расположение ярлыков на дни месяца' },
    multiple: { type: Boolean, default: false, description: 'Можно ли выбрать несколько дней' },
    date: { type: [Date, String, Number] },
    selectedDays: { type: Array, default: () => ([]) }
  },
  data ({ multiple }) {
    return {
      empty: undefined,
      selector: {},
      isLoading: false,
      isSchedule: false,
      selectorDescriptor,
      selectedWeekdays: [],
      editEvent: Object,
      calendarDays: Array
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
    setSchedule($event, value) {
      this.isSchedule = value
      if (!value) this.selector = {}
    },
    setDays (days) {
      this.calendarDays = days
    }
  },
  computed: {
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
    removeDay ({ selectedDays }) {
      return ($event, { daykey }) => {
        const index = selectedDays.findIndex(d => d.daykey == daykey)
        if (index >= 0) selectedDays.splice(index, 1)
      }
    },
    selectedLength ({ selectedDays }) {
      return selectedDays.length
    },
    selectDay ({ multiple, removeDay, compact }) {
      return function ($event, day) {
        const array = this
        const findIndex = array.findIndex(d => d.daykey === day.daykey)
          if (findIndex < 0) {
            if (multiple) {
              array.push(day)
            } else {
              if (array.length == 0) {
                array.push(day)
              } else {
                array.splice(findIndex, 1, day)
              }
            }
          } else {
            if (compact) removeDay($event, day)
          }
      }
    },
    onDaySelect ({ selectedDays, goPrev, empty, isDaySelected, selectDay, removeDay, $nextTick }) {
      return ($event, day, week) => {
        if (day == empty) {
          const entries = Object.entries(week).map(m => m[1]).filter(f => f != empty && f.date != empty && f.isprev == empty)
          if ($event.target.classList.contains('bi-check-square-fill')) {
            entries.forEach(d => $nextTick().then(() => removeDay.call(selectedDays, $event, d)))
          } else {
            entries.filter(f => !isDaySelected(f)).forEach(d => $nextTick().then(() => selectDay.call(selectedDays, $event, d)))
          } 
        } else if (day.isprev) {
            goPrev(day)
          }  else {
            if (isDaySelected(day)) removeDay.call(selectedDays, $event, day)
            else selectDay.call(selectedDays, $event, day)
          }
      }
    },
    calendarDate ({ date }) {
      const _date = new Date(date)
      return createDate(_date.getFullYear(), _date.getMonth() + 1, _date.getDate())
    },
    offConfig ({ calendarDate, sixDays }) {
      return {
        url: 'https://isdayoff.ru/api/getdata',
        method: 'get',
        params: {
          year: calendarDate.year(),
          month: calendarDate.month() + 1,
          pre: true,
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
    isDaySelected ({ selectedDays }) {
      return ({ date }) => {
        return (selectedDays.findIndex(d => {
          return ((d.date.date() === date.date() && d.date.month() === date.month()) )
        }) >= 0)
      }
    }
  },
  filters: {
    noDate (value) {
      return value != undefined ? formatter.format(value, 'mmmm YYYY') : ''
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
    width: 90%;
  }
  .cd-day.compact {
    /* max-width: 50px; */
  }
  .cd-month.compact {
    width: 350px;
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
    z-index: 100;
  }
  .schedule-calendar--grid {
    /* width: fit-content; */
  }
</style>
