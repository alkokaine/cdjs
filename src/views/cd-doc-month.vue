<template>
  <cd-setting-container>
    <cd-form :payload="payload" :descriptor="settings" :sync="true"></cd-form>
    <cd-month slot="content" :payload="payload" :schedule="holidays" property="date" :canadd="payload.canadd" :mode="payload.mode" :createnew="createnewevent" :isdayvisible="isdayvisible" :tile="false" :showheader="true">
      <cd-form slot="month-header" :descriptor="olympicdescriptor" :payload="olympicpayload" :sync="true">
        <div slot="footer"></div>
      </cd-form>
      <cd-list slot-scope="{ day }" listclass="list-unstyled" :collection="details(day)" keyfield="id">
        <div class="row" slot-scope="{ row }">
          <div class="col-1">{{ format(row) }}</div>
          <div v-if="!payload.mode" class="col-10">{{ row.name }}</div>
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
          input: 'checkbox'
        },
        {
          datafield: 'canadd',
          text: 'Можно ли добавлять события',
          input: 'checkbox'
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
          multiple: true,
          filterable: true,
          clearable: true,
          url: '/olympic/olypi/sports',
          resolveresult: (response) => (response.data.sports),
          method: 'get',
          onselect (...args) {
          },
          rules: (payload) => ([
          ])
        },
        {
          datafield: 'empty_id',
          text: 'тест',
          input: 'select',
          valuekey: 'empty_id',
          labelkey: 'label',
          values: []
        },
        {
          datafield: 'object_id',
          text: 'object_id',
          input: 'select',
          valuekey: 'ObjectID',
          labelkey: 'UltraShortName',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjMwNiIsIlVzZXJOYW1lIjoi0JDQu9C10LrRgdC10Lkg0JrQvtC60L7QstC40L0iLCJPYmplY3RJRCI6IjE3IiwiQXBwbGljYXRpb25JRCI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsImV4cCI6MTY1NzM0NzUzNywiaXNzIjoiY3Jvc3MtZCIsImF1ZCI6ImNyb3NzLWQifQ.TjrvqCqUDleM1dpGmSSoXB6BAXrY3bEVWMnFQEHzYnc'
          },
          url: '/local/api/objects/short',
          method: 'post',
          resolveresult: (response) => (response.data.Data),
          resolvepayload: (payload) => ({
            ObjectIDs: [],
            ObjectTypeID: null,
            ObjectGroupID: null,
            SearchString: ''
          })
        },
        {
          datafield: 'address',
          text: 'address',
          input: 'autocomplete',
          method: 'post',
          labelkey: 'unrestricted_value',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token 0289160a02213271903b8c31ce47c670c58c3093'
          },
          onselect (payload, event, parent) {
            console.log(this, payload, event)
          },
          resolvepayload (query, payload, parent) {
            return {
              query: query,
              count: 20,
              locations_boost: [{
                kladr_id: '51'
              }]
            }
          },
          focustrigger: false,
          clearable: true,
          url: '/suggestions/address',
          resolveresult: (response) => (response.data.suggestions)
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
              const date = new Date(e.start_time)
              Vue.set(e, 'date', date)
              Vue.set(e, 'day', date.getDate())
              Vue.set(e, 'month', date.getMonth())
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
        return dh.holidays.filter(f => dh.checkday(f, day) && (dh.olympicpayload.sport_id.length === 0 || dh.olympicpayload.sport_id.includes(f.sport_id))).sort(sorter)
      }
    },
    isdayvisible () {
      const dh = this
      return (day) => dh.payload.mode === 1 || dh.details(day).length !== 0
    }
  },
  methods: {
    checkday (exist, check) {
      if (check.date === undefined) return false
      return exist.day === check.date.getDate() && exist.date.getMonth() === check.date.getMonth()
    },
    onpropertychange (...args) {
      // console.log(...args)
    },
    createnewevent (dates) {
      const dm = this
      dates.forEach(date => {
        dm.holidays.push({
          key: date.valueOf(),
          day: date.getDate(),
          month: date.getMonth(),
          sport_id: dm.olympicpayload.sport_id,
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
