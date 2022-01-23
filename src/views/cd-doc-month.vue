<template>
  <cd-month :payload="payload">
    <div slot-scope="day">
      {{ day }}
    </div>
  </cd-month>
</template>

<script>
import CDMonth from '@/components/cd-month.vue'

export default {
  name: 'cd-doc-month',
  components: {
    'cd-month': CDMonth
  },
  data (docmonth) {
    return {
      holidays: [],
      payload: {
        year: 2022,
        month: 1
      }
    }
  }
}
</script>

<style>

</style>
