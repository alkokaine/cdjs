<template>
  <cd-setting-container>
    <cd-form :payload="payload" :descriptor="settings" :onpropertychange="onpropertychange"></cd-form>
    <cd-month slot="content" :payload="payload" :schedule="holidays" property="date" :canadd="payload.canadd" :mode="payload.mode" :createnew="createnewevent" :isdayhidden="isdayhidden">
      <cd-form slot="month-header" :descriptor="olympicdescriptor" :payload="olympicpayload" :onpropertychange="onpropertychange"></cd-form>
      <cd-list slot-scope="day" listclass="list-unstyled" :collection="details(day.day)" keyfield="id">
        <div class="row" slot-scope="event">
          <el-popover :content="event.row.name" trigger="hover" placement="top" :disabled="payload.mode === 0">
            <div slot="reference" class="col-2">{{ format(event.row) }}</div>
          </el-popover>
          <div v-if="payload.mode === 0" class="col-8">{{ event.row.name }}</div>
        </div>
        <span slot="no-data">Нет данных</span>
      </cd-list>
    </cd-month>
  </cd-setting-container>
</template>

<script>
import Vue from 'vue'
import CDSettingContainer from '@/components/cd-setting-container.vue'
import CDMonth from '@/components/cd-month.vue'
import CDForm from '@/components/cd-form.vue'
import CDList from '@/components/cd-list.vue'
export default {
  name: 'cd-doc-month',
  components: {
    'cd-month': CDMonth,
    'cd-setting-container': CDSettingContainer,
    'cd-form': CDForm,
    'cd-list': CDList
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
        },
        {
          datafield: 'canadd',
          text: 'Можно ли добавлять события',
          input: 'checkbox',
          toogle (payload) {
            Vue.set(payload, 'canadd', !payload.canadd)
          }
        }
      ],
      payload: {
        mode: 1,
        Year: 2022,
        MonthID: 2,
        canadd: true,
        workdays: false
      },
      olympicdescriptor: [
        {
          datafield: 'sport_id',
          text: 'Вид спорта',
          input: 'select',
          valuekey: 'sport_id',
          labelkey: 'nazwa',
          clearable: true,
          url: '/olympic/olypi/sports',
          resolveresult: (response) => (response.data.sports),
          method: 'get',
          onselect (payload, option) {
            Vue.set(payload, 'sport_id', option.sport_id)
          }
        }
      ],
      olympicpayload: {
        sport_id: null
      },
      timeformatter: new Intl.DateTimeFormat('ru-RU', { timeStyle: 'medium' })
    }
  },
  watch: {
    olympicpayload: {
      immediate: true,
      handler (newvalue, oldvalue) {
        const dn = this
        if (oldvalue === undefined) {
          dn.$http.get('/olympic/olypi/events').then((response) => {
            dn.holidays = response.data.events.map(e => {
              const date = new Date(e.start_time_UTC)
              Vue.set(e, 'date', date)
              Vue.set(e, 'day', date.getDate())
              Vue.set(e, 'month', date.getMonth() + 1)
              return e
            })
          })
        }
      }
    }
  },
  computed: {
    format () {
      const doc = this
      return (row) => doc.timeformatter.format(row.date)
    },
    details () {
      const sorter = (a, b) => {
        const valueofa = a.date.valueOf()
        const valueofb = b.date.valueOf()
        return valueofa - valueofb
      }
      const dh = this
      return (day) => {
        return dh.holidays.filter(f => dh.checkday(f, day) && (dh.olympicpayload.sport_id === null || f.sport_id === dh.olympicpayload.sport_id)).sort(sorter)
      }
    },
    isdayhidden () {
      const dh = this
      return (day) => dh.details(day).length === 0
    }
  },
  methods: {
    checkday (exist, check) {
      return exist.day === (+check.day) && exist.month === check.month
    },
    onpropertychange (args) {
    },
    createnewevent (dates) {
      const dm = this
      dates.forEach(date => {
        dm.holidays.push({
          key: date.valueOf(),
          day: date.getDate(),
          month: date.getMonth() + 1,
          date: date,
          name: 'no-name',
          description: 'no-description'
        })
      })
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
