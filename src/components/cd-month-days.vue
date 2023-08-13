<template>
  <cd-list :collection="grouped" keyfield="daykey" :rowclass="['my-2']"  :listclass="['list-unstyled', { 'd-none': !showDetails, 'accordion': !isgroup, 'accordion-body': isgroup  }]">
    <div slot="no-data" class="no-schedule">
      <div v-if="isSchedule" class="cd-select-days mx-auto">
        <slot name="scheduler" :month="month" :date="date"></slot>
      </div>
      <div v-else class="mx-auto schedule-month pt-5">
        <button class="btn btn-sm border btn-primary-outline" v-on:click="schedule">{{ scheduleText }}</button>
      </div>
    </div>
    <template slot="header" v-if="month">
      <div class="fs-4 fw-bold accordion-header" v-on:click="setShowDetails($event, showDetails)">{{ month.date }}</div>
    </template>
    <div slot-scope="{ row, index }" class="cd-month-day p-2">
      <template v-if="row.days">
        <cd-month-days :date="date" :month="row" class="m-2 p-2 border" :expand="showDetails" :class="{ 'accordion-item accordion-collapse': !isgroup }">
          <div slot-scope="{ day }">
            <slot :day="day"></slot>
          </div>
        </cd-month-days>
      </template>
      <template v-else>
        <slot :day="row" :index="index"></slot>
      </template>
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
    date: { type: Object },
    scheduleText: { type: String, default: 'Запланировать...' }
  },
  data ({ expand }) {
    return {
      showDetails: expand,
      isSchedule: false
    }
  },
  methods: { 
    setShowDetails(event, currnt) {
      this.showDetails = !currnt
    },
    setSchedule (value) {
      this.isSchedule = value
    }
  },
  computed: {
    isgroup ({ month }) {
      return month != undefined
    },
    schedule ({ date, month, setSchedule }) {
      return (args) => {
        console.log((month || date), args)
        setSchedule(true)
      }
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
    width: max-content;
  }
</style>