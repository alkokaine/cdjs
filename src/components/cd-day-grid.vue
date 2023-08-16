<template>
  <cd-grid class="cd-days--grid" :class="{ compact: compact }" :collection="weeksOrder" :descriptor="descriptor" keyfield="week" 
    :small="compact" borders="none" :rowclass="['month-week', { compact: compact }]" :hideheader="false"
    start-cell-th="select-week--header" start-cell-td="select-week--cell" v-on:keyup.capture="moveCursor($event, cursorDate)">
    <div slot="grid-tuner">
      <slot name="header"></slot>
    </div>
    <template slot="theader" slot-scope="{ start, property }">
      <template v-if="start && selectWeekdays"></template>
      <template v-else-if="property">
        {{ property.text }}
      </template>
    </template>
    <template slot-scope="{ start, data, property }">
      <template v-if="start">
          <slot name="week" :week="data.row">
            <button class="btn btn-link text-decoration-none bi p-0" 
                :class="{
                  'bi-plus': isNotSelected(data.row),
                  'bi-check-square': isSomeSelected(data.row),
                  'bi-check-square-fill': isFullSelected(data.row)
                }"
                data-bs-toggle="tooltip" data-bs-placement="bottom" title="Выбрать неделю" v-on:click="selectDay($event, empty, data.row)"></button>
          </slot>
        </template>
        <template v-else-if="property && data.row[property.prop.datafield]">
          <div class="p-1 mx-auto">
            <slot :day="data.row[property.prop.datafield]" :week="data.row.week">
              <cd-day :info="data.row[property.prop.datafield]" :compact="compact" v-on:click.native="selectDay($event, data.row[property.prop.datafield], data.row.week)" :is-selected="isSelected(data.row[property.prop.datafield])"></cd-day>
            </slot>
          </div>
        </template>
    </template>
    <div class="cd-days--grid-footer" slot="table-footer">
      <slot name="footer"></slot>
    </div>
  </cd-grid>
</template>
<script>
import CDGrid from './cd-grid.vue'
import CDDay from './cd-day.vue'
import { weekDescriptor } from '../common/month-days'
export default {
  name: 'cd-day-grid',
  components: {
    'cd-grid': CDGrid,
    'cd-day': CDDay
  },
  data () {
    return {
      empty: undefined
    }
  },
  props: {
    selectWeekdays: { type: Boolean, default: false, description: 'Показывать ли чекбоксы у дней недели' },
    compact: { type: Boolean, default: false, description: 'Компактный режим' },
    days: {
      type: Array,
      requierd: true,
      default: function () {
        return []
      },
      description: 'Дни месяца'
    },
    date: { type: Object, required: true },
    keyedDays: { type: Array, required: true },
    selectedDays: { type: Array, default: () => ([]) },
    selectDay: { type: Function, default: function(){} },
    compareDate: { type: Function, required: true, description: 'Функция сравнения объектов с датами' },
    weekRange: {
      type: Array,
      required: true,
      default: function () {
        return [1, 2, 3, 4, 5]
      },
      description: 'Список недель месяца'
    },
    isSelected: { type: Function, default: function(){ return false } },
    multiple: { type: Boolean }
  },
  computed: {
    isNotSelected ({ currentSelected }) {
      return ({ week }) => currentSelected(week) == 0
    },
    isSomeSelected ({ monthWeekdayCount, currentSelected }) {
      return ({ week }) => (currentSelected(week) > 0) && (currentSelected(week) < monthWeekdayCount(week))
    },
    isFullSelected ({ monthWeekdayCount, currentSelected }) {
      return ({ week }) => currentSelected(week) == monthWeekdayCount(week)
    },
    
    currentSelected ({ selectedDays, date }) {
      return (week) => (selectedDays.filter(f => f.date.year() == date.year() && f.date.month() == date.month() && f.date.week() == week)).length
    },
    monthWeekdayCount({ keyedDays }) {
      return (week) => {
        return keyedDays.filter(d => d.isprev == undefined && d.date.week() == week).length
      }
    },

    getDay () {
      return ({ date }) => (date.toDate())
    },
    descriptor ({ compact }) {
      return weekDescriptor(compact)
    },
    weekFactory ({ descriptor }) {
      return (week, days) => {
        const props = descriptor.map(p => {
          const _days = days.find(d => {
            const _day = d.date.day()
            return _day == p.day
          })
          return (Object.defineProperty({ }, p.datafield, {
            enumerable: true,
            value: _days
          }))
        })
        return Object.assign({ week: week }, ...props)
      }
    },
    weeks ({ weekRange, days, weekFactory }) {
      return weekRange.map(w => {
        const _days = days.filter(d => d.date.week() == w)
        const max = Math.max(..._days.map(m => m.daykey))
        const ww = { max, week: weekFactory(w, days.filter(d => d.date.week() === w))}
        return ww
      })
    
    },
    weeksOrder ({ weeks }) {
      return ((weeks.sort((a, b) => a.max - b.max)).map((w) => w.week))
    }
  }
}
</script>
<style>
  .cd-grid--day:hover {
    box-shadow: 0 0 6px 3px #c3c3c336;
  }
  .weekday-cell {
    width: 14%;
  }
  .weekday-cell.compact {
    width: 1em;
  }
  .cd-days--grid.compact {
  }
  .cd-day--grid-wrap {
    width: 92%;
  }
  .select-week--header {
  }
  .select-week--cell {
    vertical-align: middle;
  }
</style>
