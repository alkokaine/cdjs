<template>
  <div class="cd-day" :class="{ 'border-0 compact': compact}">
    <div v-if="!compact" class="cd-day--header row">
      <div class="cd-day--number col" :class="{ 'compact': compact }">{{ day }}</div>
      <div class="cd-day--info col">
        <div>{{ month }}</div>
        <div>{{ weekday }}</div>
      </div>
    </div>
    <div class="cd-day--content" :class="{ 'border-0 compact': compact }">
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
    compact: { type: Boolean, default: false }
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
