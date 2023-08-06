<template>
  <cd-grid class="cd-days--grid" :class="{ compact: compact }" :collection="weeksOrder" :descriptor="descriptor" keyfield="week" 
    :small="compact" borders="none" :rowclass="['month-week', { compact: compact }]" :hideheader="!compact"
    start-cell-td="w-auto">
    <div slot="grid-tuner">
      <slot name="header"></slot>
    </div>
    <template slot-scope="{ start, data, property }">
      <div class="cd-day--grid-cell">
        <template v-if="start">
          <slot name="week" :week="data.row"></slot>
        </template>
        <template v-else-if="property">
          <slot :day="data.row[property.prop.datafield]" :week="data.row.week"></slot>
        </template>
      </div>
    </template>
  </cd-grid>
</template>
<script>
import CDGrid from '@/components/cd-grid.vue'
import { weekDescriptor } from '@/common/month-days'
export default {
  name: 'cd-day-grid',
  components: {
    'cd-grid': CDGrid
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
    selectDay: { type: Function },
    compareDate: { type: Function, required: true, description: 'Функция сравнения объектов с датами' },
    weekRange: {
      type: Array,
      required: true,
      default: function () {
        return [1, 2, 3, 4, 5]
      },
      description: 'Список недель месяца'
    },
  },
  data (grid) {
    return {}
  },
  computed: {
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
    width: max-content;
  }
</style>
