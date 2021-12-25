<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-list :collection="gridexamples" keyfield="name" :listitemclicked="selectexample">
      <div class="grid-example-header" slot-scope="scope">{{ scope.row.name }}</div>
      <cd-grid slot="footer" v-if="selected" keyfield="id"
        :key="selected.name"
        :get="selected.get"
        :payload="payload"
        :descriptor="descriptor"
        :resolveresult="resolveresult"
        :collection="selected.collection"
        :total="selected.total"
        :paging="true"
        :pageSize="10"
        :resolvepayload="resolvepayload"
        :onpagechange="onpagechange">
        <template v-if="selected.filter" slot="grid-tuner">
          <cd-form :descriptor="selected.filter"
            :payload="payload"
            :onpropertychange="onfilterchange"></cd-form>
        </template>
      </cd-grid>
    </cd-list>
  </div>
</template>

<script>
import Vue from 'vue'
import CDDocGeneric from '../generic/cd-doc-generic.vue'
import ComponentInfo from '../generic/cd-doc-component-info.vue'
import CDGrid from '../components/cd-grid.vue'
import CDList from '../components/cd-list.vue'
import CDForm from '../components/cd-form.vue'
export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric,
    'cd-info': ComponentInfo,
    'cd-grid': CDGrid,
    'cd-list': CDList,
    'cd-form': CDForm
  },
  data (view) {
    return {
      infos: CDGrid.mixins.concat(CDGrid),
      selected: 0,
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
      payload: {
        limit: 10,
        minPopulation: null,
        namePrefix: null,
        distanceUnit: null,
        offset: 0,
        countryIds: null
      },
      gridexamples: [
        {
          name: 'simple',
          get: {
            method: 'get',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
          },
          collection: [],
          total: 0
        },
        {
          name: 'filtered',
          get: {
            method: 'get',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
          },
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
              datafield: 'countryIds',
              text: 'Страна',
              input: 'select',
              valuekey: 'code',
              labelkey: 'name',
              url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
              method: 'get',
              resolveresult: (response) => response.data.data,
              resolvepayload: {
                params: {
                  limit: 10,
                  namePrefix: '',
                  offset: 0
                }
              },
              isdisabled: (payload, option) => option.wikiDataId.endsWith(7),
              onselect: (payload, option, parent) => {
                const region = parent.descriptor.find(p => p.datafield === 'region_id')
                setTimeout(() => {
                  Vue.set(region, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${option.code}/regions`)
                  Vue.set(view.selected.get, 'url', 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities')
                }, 1100)
              }
            },
            {
              datafield: 'region_id',
              text: 'regions',
              input: 'select',
              valuekey: 'wikiDataId',
              labelkey: 'name',
              url: '',
              method: 'get',
              resolveresult: (response) => response.data.data,
              resolvepayload: {
                params: { limit: 10 }
              },
              isdisabled: (payload, option) => option.wikiDataId.endsWith(7),
              onselect (payload, option, descriptor) {
                setTimeout(() => {
                  Vue.set(view.selected.get, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${option.countryCode}/regions/${option.isoCode}/cities`)
                  // Vue.set(view.gridexamples[view.selected].payload, 'region_id', option.wikiDataId)
                }, 1100)
              }
            }
          ],
          total: 0,
          usefilter: true,
          collection: []
        }
      ],
      doc: [
        {
          id: 'grid-a',
          header: 'CD-GRID',
          description: ['Что-то будет']
        }
      ]
    }
  },
  methods: {
    onfilterchange ({ property, value }) {
      Vue.set(this.payload, property.datafield, value)
    },
    selectexample (event, args) {
      this.selected = args.row
    },
    resolvepayload (payload) {
      return {
        params: payload
      }
    },
    resolveresult (response) {
      Vue.set(this.selected, 'total', response.data.metadata.totalCount)
      Vue.set(this.selected, 'collection', response.data.data)
    },
    onpagechange (event, pageargs) {
      Vue.set(this.payload, 'offset', pageargs.row.offset)
    }
  }
}
</script>

<style>

</style>
