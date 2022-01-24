<template>
  <cd-month :payload="payload">
    <cd-list class="day-info" slot-scope="day" listclass="holidays-list" :collection="details(day)" keyfield="day">
      <span slot-scope="holiday">
        {{ holiday.row.name }}
      </span>
    </cd-list>
  </cd-month>
</template>

<script>
import CDMonth from '@/components/cd-month.vue'
import CDList from '@/components/cd-list.vue'
export default {
  name: 'cd-doc-month',
  components: {
    'cd-month': CDMonth,
    'cd-list': CDList
  },
  data (docmonth) {
    return {
      holidays: [],
      payload: {
        Year: 2022,
        MonthID: 3
      }
    }
  },
  watch: {
    payload: {
      immediate: true,
      deep: true,
      handler (newvalue) {
        if (newvalue === undefined) return
        const dn = this
        dn.$http.get(`https://calendarific.com/api/v2/holidays?&api_key=13fb3847e37114626655e5578ab078f14ed577eb&country=RU&year=${newvalue.Year}&month=${newvalue.MonthID}`).then(
          (response) => {
            dn.holidays = response.data.response.holidays.map(h => ({ day: h.date.datetime.day, name: h.name, description: h.description }))
          }
        )
      }
    }
  },
  computed: {
    details () {
      const dh = this
      return (day) =>
        dh.holidays.filter(f =>
          f.day === (+day.day.day))
    }
  }
}
</script>

<style>
  .day-info {
    margin: 0.5em;
  }
  .holidays-list {
    list-style: none;
  }
</style>
