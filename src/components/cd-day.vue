<template>
  <div class="cd-day" :class="{ 'opacity-25': info.isprev }">
    <div class="cd-day--container w-100">
      <div class="cd-day--header d-flex flex-row mx-auto w-100" 
        :class="{ 
          'fw-bold': isSelected, 
          'justify-space-around': compact, 
          'border-bottom border-black text-light': !compact, 
          'bg-secondary': (compact && isSelected || !compact),
          'bg-danger': isHoliday && (compact && isSelected || !compact),
          'text-body': !compact && info.isprev, 
          'text-danger': compact && isHoliday,
          'bg-secondary text-light': compact && isSelected 
        }">
        <div class="cd-day--number px-2">
          <span class="" :class="{ 'fs-6': compact, 'fs-2': !compact }">{{ dateStruct.day }}</span>
        </div>
        <div :class="{ 'd-none': compact }">
          <div class="fw-bold">{{ dateStruct.month }}</div>
          <div>{{ dateStruct.weekday }}</div>
        </div>
        <div class="d-flex justify-content-end w-100">
          <div class="w-auto text-wrap">
            <slot name="header"></slot>
          </div>
        </div>
      </div>
      <div class="cd-day--content--wrapper position-relative w-100" :class="{ 'd-none': compact, 'bg-opacity-25 bg-secondary': !compact && isSelected, 'bg-white': !compact && !isSelected}">
        <div class="cd-day--content py-2 mx-auto">
          <slot></slot>
        </div>
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
    },
    isEve ({ info }) {
      return info.code == '2'
    },
    isHoliday ({ info }) {
      return info.code == '1'
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
  .cd-day {
    cursor: pointer;
  }
  .cd-day--content {
    width: 95%;
  }
  .cd-day--container {
    width: 95%;
    height: 95%;
  }
</style>
