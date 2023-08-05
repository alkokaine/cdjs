<template>
  <div class="cd-day" :class="{ 'border p-1': !compact, 'opacity-25': info.isprev,  }">
    <div class="cd-day--container" :class="{ 'm-3': !compact, 'border-2 bg-secondary fw-bold text-light': isSelected }">
      <div class="cd-day--header p-0 m-0 d-flex flex-row" :class="{ '': compact, '': !compact }">
        <div class="cd-day--number mx-2">
          <span :class="{ 'fs-6': compact, 'fs-4 fw-bold': !compact }">{{ dateStruct.day }}</span>
        </div>
        <div class="px-2" :class="{ 'd-none': compact, 'text-end': !compact }">
          <div class="fw-bold">{{ dateStruct.month }}</div>
          <div>{{ dateStruct.weekday }}</div>
        </div>
        <div>
          <slot name="header"></slot>
        </div>
      </div>
      <div class="cd-day--content" :class="{ 'p-1': !compact }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' })
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' })
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' })
export default {
  name: 'cd-day',
  props: {
    info: { type: Object },
    compact: { type: Boolean, default: false },
    tile: { type: Boolean },
    isSelected: { type: Boolean }
  },
  data ({ info }) {
    return {
    }
  },
  computed: {
    dateStruct ({ info }) {
      const toDate = info.date.toDate()
      return {
        day: dayFormatter.format(toDate),
        weekday: weekdayFormatter.format(toDate),
        month: monthFormatter.format(toDate)
      }
    }
  }
}
</script>

<style>
  .cd-day--header {
    height: fit-content;
    /* background-color: lightgray; */
  }
  .cd-day--number {
    /* font-size: 2em; */
    max-width: min-content;
  }
  .cd-day--info {
    text-align: left;
  }
</style>
