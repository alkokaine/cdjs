<template>
  <div class="cd-day" :class="{ 'border mb-2' : tile && !compact, 'border-bottom border-start border-end': !tile && !compact }">
    <div v-if="!compact" class="cd-day--header container-sm p-0 m-0 row" :class="{ 'border-1 border-bottom' : tile }">
      <div class="cd-day--number col">
        {{ day }}
      </div>
      <div class="cd-day--info col">
        <div class="cd-day--month">{{ month }}</div>
        <div class="cd-day--weekday">{{ weekday }}</div>
      </div>
    </div>
    <div class="cd-day--content" :class="{ 'col border-start border-top': !tile && !compact, 'container-sm': !compact }">
      <slot>
        <span v-if="compact">{{ day }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' })
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' })
export default {
  name: 'cd-day',
  props: {
    info: { type: Object, required: true },
    compact: { type: Boolean, default: false },
    tile: { type: Boolean, default: true }
  },
  data (day) {
    return {
    }
  },
  computed: {
    day () {
      return dayFormatter.format(this.info.date)
    },
    weekday () {
      return weekdayFormatter.format(this.info.date)
    },
    month () {
      return monthFormatter.format(this.info.date)
    }
  }
}
</script>

<style>
  .cd-day--header {
    height: fit-content;
    background-color: lightgray;
  }
  .cd-day--number {
    font-size: 2em;
    font-weight: bold;
    max-width: min-content;
  }
  .cd-day--info {
    text-align: left;
  }
</style>
