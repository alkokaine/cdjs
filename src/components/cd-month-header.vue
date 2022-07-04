<template>
  <p class="month-header--wrap">
    <i class="btn btn-link bi bi-arrow-left-short" v-on:click="setmonth({ $event, factor: -1 }, payload)"></i>
    <span>{{ monthname }}</span>
    <i class="btn btn-link bi bi-arrow-right-short" v-on:click="setmonth({ $event, factor: 1 }, payload)"></i>
  </p>
</template>

<script>
import Vue from 'vue'
import calendar from '@/common/calendar-mixin'
export default {
  name: 'cd-month-header',
  mixins: [calendar],
  methods: {
    setmonth ({ $event, factor }, payload) {
      Vue.set(payload, 'MonthID', payload.MonthID + factor)
    }
  }
}
</script>

<style>

</style>
