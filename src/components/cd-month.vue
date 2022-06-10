<template>
  <cd-list class="cd-month container-sm" :listclass="[ 'list-unstyled', { 'row': mode }]"
    :rowclass="rootrowclass" :collection="source" keyfield="key" :isrowvisible="isdayvisible">
    <div class="month-header" slot="header">
      <slot name="month-header">
        <div v-if="showheader">{{ monthheader }}</div>
        <button v-if="mode && canadd" class="btn btn-sm btn-link" v-on:click="templateselect">Заполнить по расписанию</button>
      </slot>
    </div>
    <div class="month-item-wrap" slot-scope="content" :class="{ 'weekday-container': content.row.id }">
      <template v-if="mode">
        <cd-list class="cd-weekday--container" :collection="weekdaylist(content)" keyfield="key" listclass="list-unstyled col" :rowclass="resolvedayclass" :listitemclicked="ondayselect" :isrowvisible="isdayvisible">
          <div class="weekday-name" slot="header">
            <div v-if="selectweekday">
              <input type="checkbox" v-on:change="onweekdayselect($event, content)" :checked="isweekdayselected(content)"/>
            </div>
            {{ content.row.short_name }}
          </div>
          <div class="month-item-wrap" slot-scope="day"
            :class="{ 'prev-month': day.row.isprev, 'holiday' : day.row.code == 1, 'selected': resolvedayselected(day) }">
            <cd-day :info="day.row" :compact="compact" :tile="tile">
              <slot :day="day.row" :index="day.index"></slot>
            </cd-day>
          </div>
        </cd-list>
      </template>
      <template v-else>
        <cd-day :info="content.row" :tile="tile">
          <slot :day="content.row" :index="content.index"></slot>
        </cd-day>
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
    <div v-if="!compact && createnew" slot="footer">
      <el-dialog class="template-selector" :visible.sync="runtemplate" :close-on-click-modal="false" v-on:closed="ondialogclose" width="30%">
        <cd-form v-if="templateready" :descriptor="templatedescriptor" :payload="generatorconfig" :sync="true" :showcontrols="true">
          <cd-month class="month-template-preview" slot="footer" :payload="payload" :canadd="false" :showheader="false"
            :isdayselected="newtask.daycompare" :ondayselect="newtask.ondayselect" :onweekdayselect="weekdayselect"
            :tile="false"
            :isweekdayselected="resolveweekdayselected" :selectweekday="newtask.id === 3" :compact="true" :resolvedayclass="dayclass">
            <span slot="month-header" class="compact">{{ monthheader }}</span>
          </cd-month>
        </cd-form>
        <div class="commit-template" slot="footer">
          <button type="button" class="btn btn-sm btn-outline-secondary" v-on:click="closedialog">Отменить</button>
          <button type="button" class="btn btn-sm btn-primary" v-on:click="run($event, calendar.filter(newtask.daycompare))">Сохранить</button>
        </div>
      </el-dialog>
    </div>
  </cd-list>
</template>

<script>
import calendar from '../common/calendar-mixin'
import CDList from './cd-list.vue'
import CDForm from './cd-form.vue'
import CDDay from './cd-day.vue'
import moment from 'moment'
import { Dialog } from 'element-ui'

const daysInMonth = (year, month) => (moment(`${year}-${month}`, 'YYYY-MM')).daysInMonth()
const date = (year, month, day) => (moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'))

export default {
  name: 'cd-month',
  mixins: [calendar],
  components: {
    'cd-list': CDList,
    'cd-form': CDForm,
    'cd-day': CDDay,
    'el-dialog': Dialog
  },
  props: {
    tile: { type: Boolean, default: true },
    compact: { type: Boolean, default: false },
    createnew: {
      type: Function,
      description: 'Сколько я не думал, не нашёл лучшего варианта, кроме следующего: функция принимает массив дат, выполняет какие-то преобразования и добавляет результат в массив, переданный как свойство компонента cd-month'
    },
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
    mode: { type: [Boolean, Number], default: 1 },
    isdayvisible: { type: Function, default: (day) => (true) },
    isdayselected: { type: Function },
    format: { type: String, default: 'YYYY-MM-DD' },
    schedule: { type: [Function, Array], description: 'Данные, которые мы хотим показать в календаре' },
    property: { type: String, description: 'Имя свойства объекта из коллекции schedule, содержащее значение даты события' },
    resolvedayclass: { type: [String, Array, Function], default: () => (''), description: 'Функция, возвращающая класс для элемента cd-day' },
    ondayselect: { type: Function, default: (event, args) => {}, description: 'Функция, которая выполняется при клике на день' },
    selectweekday: { type: Boolean, default: false },
    onweekdayselect: { type: Function, default: (event, args) => {}, desciption: 'Функция, которая выполнится, если выбрать колонку с днём недели' },
    isweekdayselected: { type: Function, default: (...args) => (false) }
  },
  data (cdm) {
    return {
      generatorconfig: Object,
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
              daycompare (dayscope) {
                return dayscope.isprev === undefined && (dayscope.date.getDate() % 2 === 0) && (!cdm.generatorconfig.workdays || dayscope.code !== 1)
              }
            },
            {
              id: 2,
              text: 'Нечётные числа',
              daycompare (dayscope) {
                return dayscope.isprev === undefined && (dayscope.date.getDate() % 2 === 1) && (!cdm.generatorconfig.workdays || dayscope.code !== 1)
              }
            },
            {
              id: 3,
              text: 'Выбрать дни недели',
              daycompare (dayscope) {
                return dayscope.isprev === undefined && cdm.selectedweekdays.indexOf(dayscope.date.getDay()) !== -1 && (!cdm.generatorconfig.workdays || dayscope.code !== 1)
              }
            },
            {
              id: 4,
              text: 'Выбрать дни вручную',
              ondayselect (event, args) {
                if (args.row.isprev === undefined) {
                  const index = cdm.selecteddays.indexOf(args.row.date.getDate())
                  if (index >= 0) cdm.selecteddays.splice(index, 1)
                  else cdm.selecteddays.push(args.row.date.getDate())
                }
              },
              daycompare (dayscope) {
                return cdm.selecteddays.indexOf(dayscope.date.getDate()) !== -1
              }
            }
          ],
          onselect (payload, option) {
            cdm.newtask = option
          }
        },
        {
          input: 'checkbox',
          datafield: 'workdays',
          text: 'Только рабочие дни',
          disabled: true,
          toogle (payload) {
            cdm.generatorconfig.workdays = !cdm.generatorconfig.workdays
          }
        }
      ],
      newtask: {},
      selectedweekdays: [],
      selecteddays: []
    }
  },
  watch: {
    runtemplate: {
      handler (newvalue) {
        if (newvalue === true) {
          this.generatorconfig = {
            template_id: null,
            workdays: false
          }
        } else {
          this.generatorconfig = Object
        }
      }
    }
  },
  computed: {
    dayclass () {
      return this.newtask.id === 4 ? 'selectable' : ''
    },
    calendar () {
      const month = this
      const days = Array.from(Array(daysInMonth(month.payload.Year, month.payload.MonthID)).keys())
        .map((_d, index) => ({ date: date(month.payload.Year, month.payload.MonthID, _d + 1).toDate() }))
      const monthstart = date(month.payload.Year, month.payload.MonthID, 1)
      const weekday = monthstart.day()
      if (weekday === 1) return days
      const result = []
      let ln = weekday - 1
      if (ln < 0) ln = 6 - ln - 1
      while (ln > 0) {
        const d = monthstart.subtract(1, 'days')
        result.unshift({ date: d.toDate(), isprev: true })
        ln -= 1
      }
      return result.concat(days)
    },
    // url () {
    //   return `https://isdayoff.ru/api/getdata?year=${this.payload.Year}&month=${this.payload.MonthID}&pre=1&covid=1&sd=0`
    // },
    islistview () {
      return !this.mode
    },
    daynumber () {
      return (day) => (day.date.getDay())
    },
    templateready () {
      return typeof this.generatorconfig !== 'function'
    },
    resolvedayselected () {
      const month = this
      return (day) => {
        if (month.isdayselected !== undefined && month.isdayselected(day.row)) return 'selected'
        return ''
      }
    },
    monthdate () {
      return new Date(this.payload.Year, this.payload.MonthID - 1, 1)
    },
    monthheader () {
      return `${this.formatter.format(this.monthdate)} ${this.payload.Year}`
    },
    source () {
      return this.mode ? this.weekdays : this.calendar
    },
    weekdaylist () {
      const month = this
      if (month.calendar.length === 0) return () => []
      return (wd) => {
        return month.calendar.filter(d => d.date.getDay() === wd.row.id)
      }
    },
    rootrowclass () {
      const month = this
      return (row) => ([{ 'weekday-container col': month.mode === 1 }, row.class])
    }
  },
  methods: {
    ondialogclose () {
      this.selectedweekdays = []
      this.selecteddays = []
      this.newtask = {}
    },
    templateselect () {
      this.runtemplate = true
    },
    addday () {
    },
    ontemplatechange (...args) {
      console.log(args)
    },
    weekdayselect (event, weekday) {
      const index = this.selectedweekdays.indexOf(weekday.row.id)
      if (index === -1) this.selectedweekdays.push(weekday.row.id)
      else this.selectedweekdays.splice(index, 1)
    },
    resolveweekdayselected (weekday) {
      return this.selectedweekdays.indexOf(weekday.row.id) >= 0
    },
    closedialog () {
      this.runtemplate = false
    },
    run (event, days) {
      this.createnew(days.map(d => d.date))
    }
  }
}
</script>

<style>
  .cd-month {

  }
  .month-header {
    text-align: center;
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
  .commit-template {
    text-align: right;
  }
  .commit-template > .btn {
    margin-left: 1em;
  }
    .compact {
    margin-bottom: unset!important;
  }
  .month-template-preview.compact {
    font-size: 0.7em;
  }
  .compact:hover {
    box-shadow: none;
  }
  .selectable {
    cursor: pointer;
  }
</style>
