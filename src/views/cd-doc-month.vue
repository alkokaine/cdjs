<template>
  <cd-setting-container>
    <cd-form :payload="settings" :descriptor="descriptor" :sync="true"></cd-form>
      <cd-month slot="content" :go-prev="setDate" :date="settings.mdate" :compareDate="compareDate" :select-weekdays="settings.selectWeekdays" 
                :six-days="settings.sixDays" :compact="settings.compact" :mode="settings.mode" :orientation="settings.orientation" 
                :multiple="settings.multiple" :prepend-days="settings.prependDays">
        <div slot-scope="{ day, week }">
          <div class="month-week">{{ week }}</div>
          <div class="month-day mx-auto">{{ day }}</div>
        </div>
      </cd-month>
  </cd-setting-container>
</template>

<script>
import Vue from 'vue'
import CDSettingContainer from '@/components/cd-setting-container.vue'
import CDMonth from '@/components/cd-month.vue'
import CDForm from '@/components/cd-form.vue'
// import CDList from '@/components/cd-list.vue'
import keys from '@/views/keys'

export default {
  name: 'cd-doc-month',
  components: {
    'cd-month': CDMonth,
    'cd-setting-container': CDSettingContainer,
    'cd-form': CDForm
    // 'cd-list': CDList
  },
  data (docmonth) {
    return {
      holidays: [],

      settings: {
        compact: false,
        selectWeekdays: true,
        mdate: new Date(Date.now()),
        sixDays: false,
        mode: 'schedule',
        orientation: 'col-left',
        lang: 'en'
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
      timeformatter: new Intl.DateTimeFormat('ru-RU', { timeStyle: 'medium' })
    }
  },
  computed: {
    format () {
      const doc = this
      return (row) => doc.timeformatter.format(row.date)
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
    }
  },
  methods: {
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
    },
    compareDate ({ date }, day) {
      return date.getDate() === day.getDate() &&
        date.getMonth() === day.getMonth() &&
        date.getFullYear() === day.getFullYear()
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
</style>
