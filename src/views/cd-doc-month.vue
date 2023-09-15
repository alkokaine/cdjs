<template>
  <cd-setting-container>
    <cd-form :payload="settings" :descriptor="descriptor" :sync="true"></cd-form>
    <cd-month slot="content" :go-prev="setDate" :date="settings.mdate" :show-controls="true"
      :select-weekdays="settings.selectWeekdays" :six-days="settings.sixDays" :compact="settings.compact" 
      :mode="settings.mode" :orientation="settings.orientation" :multiple="true" 
      :prepend-days="settings.prependDays" :selected-days="selected" :hide-tabs="settings.hideTabs">
      <div slot="commands" class="mx-auto">
        <button class="btn btn-sm btn-text text-decoration-none" :class="{ 'pe-none': showSchedule}" v-on:click="setShowSchedule($event, true)">Запланировать</button>
      </div>

      <el-dialog :visible="showSchedule" slot="scheduler" slot-scope="{ current, date }">
        <cd-day-select v-if="showSchedule" class=""
          :selected="current" :date="date" :submit="submit" :reset="reset"></cd-day-select>
      </el-dialog>
      <cd-day slot-scope="{ day, isSelected }" :is-selected="isSelected" :info="day" v-on:click.native="selectDay($event, day, isSelected)">
        <div class="text-wrap">
          {{ day }}
        </div>
      </cd-day>
    </cd-month>
  </cd-setting-container>
</template>

<script>
import Vue from 'vue'
import CDSettingContainer from '@/components/cd-setting-container.vue'
import CDMonth from '@/components/cd-month.vue'
import CDForm from '@/components/cd-form.vue'
import CDDay from '@/components/cd-day.vue'
import CDDaySelect from '@/components/cd-day-select.vue'
import moment from 'moment'
const timeformatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' })

const onTemplateSelect = function (days, property, payload, selectDay) {
  Promise.resolve(property.values.find((value) => value[property.valuekey] == payload[property.datafield]))
    .then(value => Promise.resolve(days.filter(day => value.function(day))))
    .then(days => {
      days.forEach(day => selectDay({}, day))
    })
}

const formatRow = function(row) {
  return timeformatter.format(row.date)
}


import keys from '@/views/keys'

export default {
  name: 'cd-doc-month',
  components: {
    'cd-month': CDMonth,
    'cd-setting-container': CDSettingContainer,
    'cd-form': CDForm,
    'cd-day': CDDay,
    'cd-day-select': CDDaySelect
  },
  data (docmonth) {
    return {
      template: Function,
      holidays: [],
      onTemplateSelect (days, selectDay) {
        return function (property, payload) { 
          onTemplateSelect.call(docmonth, days, property, payload, selectDay)
        }
      },
      showSchedule: false,
      selected: [],
      settings: {
        compact: false,
        selectWeekdays: true,
        mdate: new Date(Date.now()),
        sixDays: false,
        mode: 'schedule',
        orientation: 'col-left',
        lang: 'en'
      },
      scheduler: {
        mdate: new Date(Date.now()),
        selector: {},
      },
      descriptor: [
        {
          datafield: 'compact',
          text: 'Компактный режим',
          input: 'checkbox'
        },
        {
          datafield: 'selectWeekdays',
          text: 'Чекбоксы у дней недели',
          input: 'checkbox'
        },
        {
          datafield: 'prependDays',
          text: 'Дополнять первую неделю месяца днями из предыдущего месяца',
          input: 'checkbox'
        },
        {
          datafield: 'multiple',
          text: 'Можно ли выбрать несколько дней',
          input: 'checkbox'
        },
        {
          datafield: 'mdate',
          text: 'Дата календаря',
          input: 'date'
        },
        {
          datafield: 'sixDays',
          text: 'Шестидневная рабочая неделя',
          input: 'checkbox'
        },
        {
          datafield: 'mode',
          text: 'Режим',
          input: 'select',
          valuekey: 'mode',
          labelkey: 'label',
          values: [
            {
              mode: 'schedule',
              label: 'таблица'
            },
            {
              mode: 'list',
              label: 'список'
            }
          ]
        },
        {
          datafield: 'hideTabs',
          text: 'Скрыть вкладки',
          input: 'checkbox',
          hidden: ({ mode }) => mode == 'schedule'
        },
        {
          datafield: 'orientation',
          text: 'ориентация',
          input: 'select',
          labelkey: 'label',
          valuekey: 'value',
          values: [
            {
              label: 'row-top',
              value: 'row-top'
            },
            {
              label: 'row-bottom',
              value: 'row-bottom'
            },
            {
              label: 'col-left',
              value: 'col-left'
            },
            {
              label: 'col-right',
              value: 'col-right'
            }
          ],
          hidden: row => row.mode === 'schedule'
        },
        {
          datafield: 'lang',
          text: 'язык',
          input: 'select',
          labelkey: 'text',
          valuekey: 'lang',
          values: [
            { text: 'английский', lang: 'en' },
            { text: 'фарси', lang: 'fa' }
          ]
        }
      ],
      selected: []
    }
  },
  filters: {
    formatMonth (value) {
      return timeformatter.format(value, { month: '' })
    }
  },
  computed: {
    selectDay ({ selected }) {
      return (event, row, isSelected) => {
        if (isSelected) {
          const index = selected.findIndex(s => s.daykey == row.daykey)
          selected.splice(index, 1)
        } else {
          selected.push(row)
        }
      }
    },
    submit ({ setShowSchedule, selected }) {
      return ({ $event, payload }) => {
        Promise.resolve(selected.push(...payload))
          .then(() => setShowSchedule(false))
      }
    },
    reset ({ setShowSchedule }) {
      return ({ $event, payload }) => {
        setShowSchedule(false)
      }
    },
    
    format () {
      return formatRow
    },
    details () {
      const sorter = (a, b) => {
        const valueofa = a.date.valueOf()
        const valueofb = b.date.valueOf()
        return valueofa - valueofb
      }
      const dh = this
      return (day) => {
        return dh.holidays.filter(f => dh.checkday(f, day) && (dh.olympicpayload.sport_id.length === 0 || dh.olympicpayload.sport_id.includes(f.sport_id))).sort(sorter)
      }
    },
    isdayvisible () {
      const dh = this
      return (day) => dh.payload.mode === 1 || dh.details(day).length !== 0
    },
  },
  methods: {
    setShowSchedule (event, value) {
      this.showSchedule = value
    },
    confirmSelected (event, selection) {
      this.showSchedule = false
      this.selected = [...selection]
    },
    setDate ({ date }) {
      this.settings.mdate = date.toDate()
    },
    checkday (exist, check) {
      if (check.date === undefined) return false
      return exist.day === check.date.getDate() && exist.date.getMonth() === check.date.getMonth()
    },
    onpropertychange (...args) {
      // console.log(...args)
    },
    createnewevent (dates, payload, callback) {
      const dm = this
      dates.forEach(d => {
        dm.holidays.push({
          key: d.date.valueOf(),
          day: d.date.getDate(),
          month: d.date.getMonth(),
          sport_id: dm.olympicpayload.sport_id,
          date: d.date,
          name: 'no-name',
          description: 'no-description'
        })
      })
      Vue.set(dm.payload, 'Year', payload.Year)
      Vue.set(dm.payload, 'MonthID', payload.MonthID)
      callback()
    }
  }
}
</script>

<style>
  .day-info {
    margin: 0.5em;
  }
  .holidays-list {
    list-style: none;
    padding-inline-start: unset;
  }
  .day-holidays {
    list-style: none;
    padding-inline-start: unset;
  }
  .setting-form--container {
  }
  .month-day {
    width: 95%;
  }
  .month-schedule--wrap {
    /* z-index: 10; */
  }
  .month-scheduler {
    width: min-content;
  }
  .form-month-schedule {
    width: fit-content;
  }
  .month-nav {
    max-width: min-content;
  }
</style>
