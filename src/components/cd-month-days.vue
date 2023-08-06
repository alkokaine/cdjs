<template>
  <cd-list :collection="grouped" keyfield="daykey" :rowclass="['my-2', { 'accordion-item accordion-collapse': !isgroup }]"  :listclass="['list-unstyled', { 'd-none': !showDetails, 'accordion': !isgroup, 'accordion-body': isgroup  }]">
    <template slot="header" v-if="month">
      <div class="fs-4 fw-bold accordion-header" v-on:click="setShowDetails($event, showDetails)">{{ month.date }}</div>
    </template>
    <div slot-scope="{ row, index }" class="cd-month-day">
      <template v-if="row.days">
        <cd-month-days :month="row" class="m-2 p-2 border" :expand="showDetails">
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
    expand: { type: Boolean, default: true }
  },
  data ({ expand }) {
    return {
      showDetails: expand
    }
  },
  methods: { 
    setShowDetails(event, currnt) {
      this.showDetails = !currnt
    }
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