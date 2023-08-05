<template>
  <div class="cd-month--wrapper">
    <slot name="month-header"></slot>
    <template v-if="ischedule">
      <cd-day-grid class="cd-month" :compact="compact"
        :week-range="weekRange" :days="keyedDays" :compare-date="compareDate"
        :select-weekdays="selectWeekdays" :multiple="multiple">
        <div slot="header">grid-header {{ calendarDate }}</div>
        <cd-day slot-scope="{ day, week }" v-if="day" :info="day" :compact="compact" v-on:click.native="onDaySelect($event, day, week)" :is-selected="isDaySelected(day)">
            <div slot="header" class="cd-day--header">
              <slot name="header" :day="day" :week="week"></slot>
            </div>
            <template v-if="!compact">
              <slot :day="day" :week="week"></slot>
            </template>
        </cd-day>
      </cd-day-grid>
    </template>
    <template v-else>
      <cd-day-tabs class="cd-month" :days="keyedDays" :select-day="onDaySelect" :orientation="orientation"
        :compare-date="compareDate" :multiple="multiple" :selected-days="selectedDays">
        <div slot="header">tab-header {{ calendarDate }}</div>
        <cd-day slot-scope="{ day }" :info="day" :is-selected="isDaySelected(day)">
          <div slot="header">
            <slot name="header" :day="day"></slot>
          </div>
          <slot :day="day"></slot>
        </cd-day>
      </cd-day-tabs>
    </template>
    <slot name="month-footer"></slot>
  </div>
</template>

<script>
import axios from 'axios'
import { createDate, prevMonthDays } from '@/common/month-days'
import utils from '@/common/utils'
import CDDayGrid from '@/components/cd-day-grid.vue'
import CDDayTab from '@/components/cd-day-tabs.vue'
import CDDay from '@/components/cd-day.vue'

export default {
  name: 'cd-month',
  components: {
    'cd-day-grid': CDDayGrid,
    'cd-day': CDDay,
    'cd-day-tabs': CDDayTab
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
    date: { type: [Date, String, Number] }
  },
  data (calendar) {
    return {
      isLoading: false,
      selectedWeekdays: [],
      selectedDays: [],
      editEvent: Object
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
  },
  computed: {
    onDaySelect ({ selectedDays, multiple, goPrev }) {
      return ($event, day, week) => {
        if (day.isprev) {
          goPrev(day)
        }  else {
          const findIndex = selectedDays.findIndex(d => d.daykey === day.daykey)
          if (findIndex === -1) {
            if (multiple) {
              selectedDays.push(day)
            } else {
              if (selectedDays.length == 0) {
                selectedDays.push(day)
              } else {
                selectedDays.splice(findIndex, 1, day)
              }
            }
          } else {
            selectedDays.splice(findIndex, 1)
          }
        }
        
      }
    },
    calendarDate ({ date }) {
      const _date = new Date(date)
      return createDate(_date.getFullYear(), _date.getMonth() + 1, _date.getDate())
    },
    offConfig ({ calendarDate }) {
      return {
        url: 'https://isdayoff.ru/api/getdata',
        method: 'get',
        params: {
          year: calendarDate.year(),
          month: calendarDate.month() + 1
        }
      }
    },
    ischedule ({ mode }) {
      return mode === 'schedule'
    },
    days ({ calendarDate, prependDays }) {
      return (prependDays ? prevMonthDays(calendarDate) : [])
        .concat(
          Array.from(Array(calendarDate.daysInMonth()).keys())
            .map(d => ({ date: createDate(calendarDate.year(), calendarDate.month() + 1, d + 1) }))
        )
    },
    $axios ({ resolveresult = ({ request }) => console.log(request.response) , offConfig }) {
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
      return axiosInstance(offConfig).then(response => resolveresult(response)).catch(error => errorRequest(error))
    },
    weekNumbers ({ days }) {
      return days.map(d => d.date.week())
    },
    keyedDays ({ days }) {
      return days.map(m => ({ isprev: m.isprev, date: m.date, daykey: m.date.unix() }))
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
        return selectedDays.findIndex(d => d.date.date() === date.date() && d.date.month() === date.month()) >= 0
      }
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
</style>
