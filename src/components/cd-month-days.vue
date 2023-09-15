<template>
  <cd-list :collection="grouped" keyfield="daykey" :rowclass="['my-2']"  :listclass="['list-unstyled mb-0']">
    <div slot-scope="{ row, index }" class="cd-month-day p-2">
      <template v-if="row.days">
        <cd-month-days :date="date" :month="row" class="m-2 p-2 border">
          <div slot-scope="{ day }">
            <slot :day="day"></slot>
          </div>
        </cd-month-days>
      </template>
      <template v-else>
        <slot :day="row" :index="index"></slot>
      </template>
    </div>
    <div slot="footer">
      <slot name="footer" :month="month" :date="date"></slot>
    </div>
  </cd-list>
</template>
<script>
import CDList from './cd-list.vue'
import { createDate } from '../common/month-days'
export default {
  name: 'cd-month-days',
  components: {
    'cd-list': CDList
  },
  props: {
    month: { type: Object },
    collection: { type: Array },
    expand: { type: Boolean, default: true },
    date: { type: Object }
  },
  data ({ expand }) {
    return {
      showDetails: expand
    }
  },
  methods: { 
    setShowDetails(event, currnt) {
      this.showDetails = !currnt
    },
  },
  computed: {
    isgroup ({ month }) {
      return month != undefined
    },
    days ({ month, collection }) {
      return ((month || {}).days || collection)
    },
    grouped ({ month, collection }) {
      if (month == undefined) {
        return collection.reduce((acc, cur, i) => {
          const daykey = createDate(cur.date.year(), cur.date.month() + 1, 1)
          const unix = daykey.unix()
          const index = acc.findIndex(t => t.daykey == unix)
          if (index < 0) {
            acc.push({
              date: daykey,
              daykey: daykey.unix(),
              days: [cur]
            })
          } else {
            acc[index].days.push(cur)
          }
          return acc;
        }, [])
      } else {
        return month.days
      }
    }
  }
}
</script>
<style>
  .schedule-month {
    max-width: min-content;
  }
  .cd-select-days {
  }
</style>