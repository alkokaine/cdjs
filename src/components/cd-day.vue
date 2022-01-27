<template>
  <div class="cd-day" :class="{ 'cd-holiday': day.code == 1 }">
    <div class="cd-day--header row">
      <div class="cd-day--number col">{{ day.day }}</div>
      <div class="cd-day--info col">
        <slot name="info"></slot>
      </div>
    </div>
    <div class="cd-day--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cd-day',
  props: {
    day: { type: Object, required: true }
  }
}
</script>

<style>
</style>
