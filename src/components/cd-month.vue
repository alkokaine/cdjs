<template>
  <cd-list class="cd-month" :listitemclicked="ondayselect" :listclass="[ 'list-unstyled', { 'row': payload.mode }]"
    :rowclass="rootrowclass" :collection="source" keyfield="key" :isrowvisible="isdayvisible">
    <div class="month-header" slot="header">
      <slot name="month-header">
        <div v-if="showheader">{{ monthheader }}</div>
        <button v-if="payload.mode && canadd" class="btn btn-sm btn-link" v-on:click="templateselect">Заполнить по расписанию</button>
      </slot>
    </div>
    <div class="month-item-wrap" slot-scope="content" :class="{ 'weekday-container': content.row.id }">
      <template v-if="payload.mode">
        <cd-list class="cd-weekday--container" :collection="weekdaylist(content)" keyfield="key" listclass="list-unstyled">
          <div class="weekday-name" slot="header">
            <div v-if="selectweekday">
              <input type="checkbox" v-on:change="onweekdayselect($event, content)"/>
            </div>
            {{ content.row.short_name }}
          </div>
          <div class="month-item-wrap" slot-scope="day"
            :class="{ 'prev-month': day.row.isprev, 'holiday' : day.row.code == 1, 'selected': resolvedayselected(day) }">
            <slot :day="day.row"></slot>
          </div>
        </cd-list>
      </template>
      <template v-else>
        <slot :day="content.row"></slot>
      </template>
    </div>
    <template v-if="canadd && !payload.mode">
      <div class="cd-day new-day--template container-sm" slot="placeholder">
        <div class="cd-day--number col btn btn-group btn-group-lg" role="group" aria-label="new-day-group">
          <button class="btn bi bi-calendar2-week btn-link" v-on:click.stop="templateselect"></button>
          <button class="btn bi bi-calendar3-event btn-link" v-on:click.stop="addday"></button>
        </div>
      </div>
    </template>
    <div class="month-no-data" slot="no-data">
      Нет данных
    </div>
    <div slot="footer">
      <el-dialog class="template-selector" :visible.sync="runtemplate" :close-on-click-modal="false" v-on:closed="ondialogclose">
        <cd-form :descriptor="templatedescriptor" :payload="newtask" :onpropertychange="ontemplatechange">
          <cd-month class="month-template-preview" slot="footer" :payload="payload" :canadd="false" :showheader="false"
            :isdayselected="newtask.daycompare" :ondayselect="newtask.ondayselect" :onweekdayselect="weekdayselect"
            :selectweekday="newtask.id === 3">
            <div class="preview-day-number" slot-scope="scope">
              {{ scope.day.day }}
            </div>
          </cd-month>
        </cd-form>
      </el-dialog>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
import CDForm from './cd-form.vue'
import moment from 'moment'
import month from '@/common/calendar-mixin'
import { Dialog } from 'element-ui'

const daysInMonth = (year, month) => (moment(`${year}-${month}`, 'YYYY-MM')).daysInMonth()
const date = (year, month, day) => (moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'))

export default {
  name: 'cd-month',
  mixins: [month],
  components: {
    'cd-list': CDList,
    'cd-form': CDForm,
    'el-dialog': Dialog
  },
  props: {
    showheader: { type: Boolean, default: true, description: 'Переключатель видимости месяца-года' },
    canadd: { type: Boolean, default: true, description: 'Можно ли добавлять события в календарь' },
    weekdays: {
      type: Array,
      default: function () {
        return [
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
          }
        ]
      },
      description: 'Массив дней недели'
    },
    isdayselected: { type: Function },
    format: { type: String, default: 'YYYY-MM-DD' },
    schedule: { type: [Function, Array], description: 'Данные, которые мы хотим показать в календаре' },
    property: { type: String, description: 'Имя свойства объекта из коллекции schedule, содержащее значение даты события' },
    resolvedayclass: { type: Function, default: () => (''), description: 'Функция, возвращающая класс для элемента cd-day' },
    ondayselect: { type: Function, default: (event, args) => {}, description: 'Функция, которая выполняется при клике на день' },
    selectweekday: { type: Boolean, default: false },
    onweekdayselect: { type: Function, default: (event, args) => {}, desciption: 'Функция, которая выполнится, если выбрать колонку с днём недели' }
  },
  data (cdm) {
    return {
      calendar: [],
      runtemplate: false,
      formatter: new Intl.DateTimeFormat('ru-RU', { month: 'long' }),
      templatedescriptor: [
        {
          datafield: 'template_id',
          text: 'Выберите шаблон',
          input: 'select',
          labelkey: 'text',
          valuekey: 'id',
          values: [
            {
              id: 1,
              text: 'Чётные числа',
              ondayselect (...args) {
                console.log(args)
              },
              daycompare (dayscope) {
                return dayscope.row.isprev === undefined && (dayscope.row.day % 2 === 0)
              }
            },
            {
              id: 2,
              text: 'Нечётные числа',
              daycompare (dayscope) {
                return dayscope.row.isprev === undefined && (dayscope.row.day % 2 === 1)
              }
            },
            {
              id: 3,
              text: 'Выбрать дни недели',
              daycompare (dayscope) {
                return dayscope.row.isprev === undefined && cdm.selectedweekdays.indexOf(dayscope.row.weekday) !== -1
              }
            },
            {
              id: 4,
              text: 'Выбрать дни вручную',
              ondayselect (...args) {
                console.log(args)
              },
              daycompare (...args) {
                return false
              }
            }
          ],
          onselect (payload, option) {
            cdm.newtask = option
          }
        }
      ],
      newtask: {},
      selectedweekdays: []
    }
  },
  watch: {
    payload: {
      deep: true,
      immediate: true,
      handler (newvalue) {
        const month = this
        let days = []
        if (newvalue !== undefined && newvalue.Year !== undefined && newvalue.MonthID !== undefined) {
          month.$http.get(`https://isdayoff.ru/api/getdata?year=${newvalue.Year}&month=${(newvalue.MonthID)}&pre=1&covid=1&sd=0`)
            .then((response) => {
              // приходит строчка из нулей, единиц, двоек и четвёрок, индекс символа указывает на номер дня (начиная с нуля)
              // а значение -- код дня в производственном календаре
              // для начала переведём строчку в массив нулей, единиц, двоек и четвёрок
              days = Array.from(response.request.response)
                .map((m, index) => ({ day: index + 1, code: Number(m), weekday: date(newvalue.Year, newvalue.MonthID, index + 1).day(), month: newvalue.MonthID }))
            }).catch((error) => {
              console.error(`[CDJS] ${error}`)
              days = Array.from(Array(daysInMonth(newvalue.Year, newvalue.MonthID)).keys()).map((_d, index) => ({ day: index + 1 }))
            }).finally(() => {
              const first = days[0]
              const fd = date(newvalue.Year, newvalue.MonthID, first.day)
              const monthstart = fd.day()
              if (monthstart === 1) return days
              const result = []
              let ln = monthstart - 1
              if (ln < 0) ln = 6 - ln - 1
              while (ln > 0) {
                const d = fd.subtract(1, 'days')
                result.unshift({ day: d.date(), weekday: d.day(), isprev: true, month: d.month() + 1 })
                ln -= 1
              }
              month.calendar = result.concat(days)
            })
        }
      }
    }
  },
  computed: {
    resolvedayselected () {
      const month = this
      return (day) => {
        if (month.isdayselected !== undefined && month.isdayselected(day)) return 'selected'
        return ''
      }
    },
    monthdate () {
      return new Date(this.payload.Year, this.payload.MonthID - 1, 1)
    },
    monthheader () {
      return `${this.formatter.format(this.monthdate)} ${this.payload.Year}`
    },
    scheduleref () {
      const month = this
      return month.schedule.map(d => moment(d[month.property], month.format).date())
    },
    source () {
      return this.payload.mode === 0 ? this.calendar : this.weekdays
    },
    weekdaylist () {
      const month = this
      if (month.calendar.length === 0) return () => []
      return (wd) => {
        return month.calendar.filter(d => d.weekday === wd.row.id)
      }
    },
    isdayvisible () {
      const month = this
      if (month.payload.mode) {
        return (d) => true
      } else {
        return (d) => {
          if (d.month !== month.payload.MonthID) return false
          return month.scheduleref.indexOf(d.day) >= 0
        }
      }
    },
    rootrowclass () {
      const month = this
      return (row) => ([{ 'weekday-container col': month.payload.mode === 1 }, row.class])
    }
  },
  methods: {
    ondialogclose () {
      this.selectedweekdays = []
      this.newtask = {}
    },
    templateselect () {
      console.log('template select')
      this.runtemplate = true
    },
    addday () {
      console.log('add day')
    },
    ontemplatechange (...args) {
      console.log(args)
    },
    weekdayselect (event, weekday) {
      const index = this.selectedweekdays.indexOf(weekday.row.id)
      if (index === -1) this.selectedweekdays.push(weekday.row.id)
      else this.selectedweekdays.splice(index, 1)
    }
  }
}
</script>

<style>
  .cd-month {
    margin: 1em;
  }
  .month-header {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 2em;
  }
  .prev-month {
    opacity: 0.5;
    pointer-events: none;
  }
  .cd-weekend {
    color: salmon;
  }
  .holiday {
    color: salmon;
  }
  .weekday-name {
    font-size: 1.5em;
    user-select: none;
    text-align: center;
    font-weight: bold;
  }
  .weekday-container {
    text-align: center;
  }
  .new-day--template {
    text-align: center;
  }
  i {
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  .month-no-data {
    padding-top: 2em;
    padding-bottom: 2em;
    margin-bottom: 1em;
    text-align: center;
    border: 0.01em solid gray;
  }
  .template-selector {
    width: inherit;
  }
  .month-item-wrap.selected {
    background-color: rgba(117, 115, 115, 0.445);
    font-weight: bold;
  }
  .template-weekday-list {
    font-size: 1rem;
    font-weight: 200;
  }
  .preview-day-number {
    padding: 3px;
  }
</style>
