<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-grid :get="get" :descriptor="descriptor" keyfield="id" :payload="payload" :resolveresult="resolveresult" :collection="cities" :total="total" :paging="true" :pageSize="10" :resolvepayload="resolvepayload" :onpagechange="onpagechange"></cd-grid>
    <cd-grid :get="get" :descriptor="descriptor" keyfield="id" :payload="payload2" :resolveresult="resolveresult2" :collection="cities2" :total="total2" :paging="true" :pageSize="10" :resolvepayload="resolvepayload" :onpagechange="onpagechange2" :usefilter="true" :filter="filter"></cd-grid>
  </div>
</template>

<script>
import Vue from 'vue'
import CDDocGeneric from '../generic/cd-doc-generic.vue'
import ComponentInfo from '../generic/cd-doc-component-info.vue'
import CDGrid from '../components/cd-grid.vue'

export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric,
    'cd-info': ComponentInfo,
    'cd-grid': CDGrid
  },
  data (view) {
    return {
      filter: [
        {
          datafield: 'minPopulation',
          text: 'minPopulation'
        },
        {
          datafield: 'namePrefix',
          text: 'namePrefix'
        },
        {
          datafield: 'wikiDataId',
          text: 'Страна',
          input: 'select',
          valuekey: 'wikiDataId',
          labelkey: 'name',
          url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
          method: 'get',
          resolveresult: (response) => response.data.data,
          resolvepayload: (payload) => {
            return {
              params: {
                limit: 10,
                namePrefix: '',
                offset: 0
              }
            }
          },
          isdisabled: (payload, option) => option.wikiDataId.endsWith(7),
          onselect: (payload, option) => {
            Vue.set(payload, 'countryIds', `${option.code},`)
          }
        }
      ],
      payload2: {
        limit: 10,
        minPopulation: null,
        namePrefix: null,
        distanceUnit: null,
        offset: 0,
        excludedCountryIds: null
      },
      total2: 0,
      cities2: [],
      infos: CDGrid.mixins.concat(CDGrid),
      get: {
        method: 'get',
        url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
      },
      descriptor: [
        {
          datafield: 'city',
          text: 'city'
        },
        {
          datafield: 'country',
          text: 'country'
        },
        {
          datafield: 'countryCode',
          text: 'countryCode'
        },
        {
          datafield: 'latitude',
          text: 'latitude'
        },
        {
          datafield: 'longitude',
          text: 'longitude'
        },
        {
          datafield: 'region',
          text: 'region'
        },
        {
          datafield: 'regionCode',
          text: 'regionCode'
        },
        {
          datafield: 'wikiDataId',
          text: 'wikiDataId'
        }
      ],
      doc: [
        {
          id: 'grid-a',
          header: 'CD-GRID',
          description: ['Что-то будет']
        }
      ],
      payload: {
        limit: 10,
        minPopulation: null,
        namePrefix: null,
        distanceUnit: null,
        offset: 0,
        excludedCountryIds: null
      },
      cities: [],
      total: 0
    }
  },
  methods: {
    resolvepayload (payload) {
      return {
        params: payload
      }
    },
    resolveresult (response) {
      this.cities = response.data.data
      this.total = response.data.metadata.totalCount
    },
    resolveresult2 (response) {
      this.cities2 = response.data.data
      this.total2 = response.data.metadata.totalCount
    },
    onpagechange (event, pageargs) {
      this.payload.offset = pageargs.row.offset
    },
    onpagechange2 (event, pageargs) {
      this.payload2.offset = pageargs.row.offset
    }
  }
}
</script>

<style>

</style>
