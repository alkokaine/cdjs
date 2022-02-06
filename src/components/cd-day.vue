<template>
  <div class="cd-day" :class="{ 'border-0 compact': compact}">
    <div v-if="!compact" class="cd-day--header row">
      <div class="cd-day--number col" :class="{ 'compact': compact }">{{ day }}</div>
      <div class="cd-day--info col">
        <div>{{ month }}</div>
        <div>{{ weekday }}</div>
      </div>
    </div>
    <div class="cd-day--content" :class="{ 'border-0': compact }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import month from '@/common/calendar-mixin'
import moment from 'moment'
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' })
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' })
export default {
  name: 'cd-day',
  mixins: [month],
  props: {
    info: { type: Object, required: true },
    compact: { type: Boolean, default: false }
  },
  data (day) {
    return {
    }
  },
  computed: {
    date () {
      const day = this
      const resolveyear = day.info.isprev && day.info.month === 12
        ? day.payload.Year - 1
        : day.payload.Year
      return moment([resolveyear, day.info.month - 1, day.info.day]).toDate()
    },
    day () {
      return dayFormatter.format(this.date)
    },
    weekday () {
      return weekdayFormatter.format(this.date)
    },
    month () {
      return monthFormatter.format(this.date)
    }
  }
}
</script>

<style>
  .compact {
    margin-bottom: unset!important;
  }
  .cd-day--number {
    font-size: 2em;
    font-weight: bold;
    padding-left: 1em;
  }
  .cd-day {
    border: 1px solid;
    margin-bottom: 1em;
  }
  .cd-day:hover {
    box-shadow: 0 0.25em 1em rgb(99, 99, 99);
  }
  .cd-day--info {
    width: 20%;
    line-height: 1em;
    margin: auto;
    text-align: right;
    padding-right: 2em;
}
  .cd-day--header {
    cursor: default;
    user-select: none;
  }
  .cd-day--content {
    padding: 0.5em;
    border-top: 1px solid;
    color: unset;
  }
</style>
