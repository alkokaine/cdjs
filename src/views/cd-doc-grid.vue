<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-grid :crud="crud" :descriptor="descriptor" keyfield="id" :payload="payload" :resolveresult="resolveresult" :collection="cities" :total="total" :paging="true" :pageSize="10" :resolvepayload="resolvepayload" :onpagechange="onpagechange"></cd-grid>
  </div>
</template>

<script>
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
      infos: CDGrid.mixins.concat(CDGrid),
      crud: {
        get: {
          method: 'get',
          url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
        }
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
    onpagechange (event, pageargs) {
      this.payload.offset = pageargs.row.offset
    }
  }
}
</script>

<style>

</style>
