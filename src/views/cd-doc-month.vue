<template>
  <cd-setting-container>
    <cd-form :payload="payload" :descriptor="settings" :onpropertychange="onpropertychange"></cd-form>
    <cd-month v-if="holidays.length" slot="content" :payload="payload" :schedule="holidays">
      <cd-day slot-scope="day" :day="day.day">
        <div slot="info">
          <div>{{ day.day.weekday }}</div>
          <div>{{ day.day.month_name }}</div>
        </div>
        <cd-list listclass="day-holidays" :collection="details(day.day)" keyfield="day">
          <el-popover slot-scope="holiday" :content="holiday.row.description" trigger="hover">
            <span slot="reference">{{ holiday.row.name }}</span>
          </el-popover>
        </cd-list>
      </cd-day>
    </cd-month>
  </cd-setting-container>
</template>

<script>
import Vue from 'vue'
import CDSettingContainer from '@/components/cd-setting-container.vue'
import CDMonth from '@/components/cd-month.vue'
import CDList from '@/components/cd-list.vue'
import CDDay from '@/components/cd-day.vue'
import CDForm from '@/components/cd-form.vue'
export default {
  name: 'cd-doc-month',
  components: {
    'cd-month': CDMonth,
    'cd-day': CDDay,
    'cd-list': CDList,
    'cd-setting-container': CDSettingContainer,
    'cd-form': CDForm
  },
  data (docmonth) {
    return {
      holidays: [],
      settings: [
        {
          datafield: 'mode',
          text: 'Показывать все',
          input: 'checkbox',
          toogle (payload) {
            if (payload.mode === 0) Vue.set(payload, 'mode', 1)
            else Vue.set(payload, 'mode', 0)
          }
        }
      ],
      payload: {
        mode: 1,
        Year: 2022,
        MonthID: 1
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
            dn.holidays = response.data.response.holidays.map(h => ({ day: h.date.datetime.day, month: h.date.datetime.month, name: h.name, description: h.description }))
          }
        )
      }
    }
  },
  computed: {
    details () {
      const dh = this
      return (day) => {
        return dh.holidays.filter(f => dh.checkday(f, day))
      }
    }
  },
  methods: {
    checkday (exist, check) {
      return exist.day === (+check.day) && exist.month === (check.month + 1)
    },
    onpropertychange (args) {
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
    padding-inline-start: unset;
  }
  .day-holidays {
    list-style: none;
    padding-inline-start: unset;
  }
</style>
