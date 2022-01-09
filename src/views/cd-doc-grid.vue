<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-tabs class="examples-list" :tabs="gridexamples" keyfield="name" :current="currentindex" :ontabselected="selectexample">
      <cd-form v-if="settingform" :descriptor="settingform.descriptor" :payload="settingform.payload" :onpropertychange="onsettingchanged"></cd-form>
      <cd-prop-list v-if="settingform" :descriptor="grid.descriptor" :cangenerate="collection.length > 0" :generateproperties="generateproperties"></cd-prop-list>
      <cd-grid v-if="grid" class="example-grid" ref="example" :keyfield="grid.keyfield"
        :get="grid.get"
        :payload="payload"
        :descriptor="grid.descriptor"
        :resolveresult="grid.resolveresult"
        :resolvepayload="grid.resolvepayload"
        :collection="collection"
        :total="total"
        :paging="grid.paging"
        :pageSize="10"
        :onpagechange="onpagechange">
        <div slot="grid-tuner">
          <cd-form v-if="grid.usefilter" class="cd-grid--filter" :descriptor="grid.filter"
            :payload="payload"
            :inline="true"
            :onpropertychange="onfilterchange"></cd-form>
        </div>
      </cd-grid>
    </cd-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import CDDocGeneric from '../generic/cd-doc-generic.vue'
import ComponentInfo from '../generic/cd-doc-component-info.vue'
import CDGrid from '../components/cd-grid.vue'
import CDForm from '../components/cd-form.vue'
import CDTabs from '../components/cd-tabs.vue'
import CDPropList from '../generic/cd-prop-list.vue'
export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric,
    'cd-info': ComponentInfo,
    'cd-grid': CDGrid,
    'cd-form': CDForm,
    'cd-tabs': CDTabs,
    'cd-prop-list': CDPropList
  },
  props: {
    citydescriptor: {
      type: Array,
      default: function () {
        return [
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
        ]
      }
    },
    cityfilter: {
      type: Array,
      default: function () {
        const view = this
        return [
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
            resolvepayload: {
              params: {
                offset: 0,
                limit: 10
              }
            },
            resolveresult: (response) => response.data.data,
            isdisabled: (payload, option) => option.wikiDataId.endsWith(7),
            onselect: (payload, option, parent) => {
              const region = parent.descriptor.find(p => p.datafield === 'region_id')
              Vue.set(region, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${option.code}/regions`)
              if (view.grid.get.url !== 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities') {
                Vue.nextTick(() => {
                  Vue.set(view.grid.get, 'url', 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities')
                })
              }
              Vue.nextTick(() => {
                Vue.set(payload, 'countryIds', option.code)
              })
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
              params: {
                offset: 0,
                limit: 10
              }
            },
            isdisabled: (payload, option) => option.wikiDataId.endsWith(7),
            onselect (payload, option, descriptor) {
              setTimeout(() => {
                Vue.set(view.grid.get, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${option.countryCode}/regions/${option.isoCode}/cities`)
              }, 1100)
            }
          }
        ]
      }
    },
    simplegrid: {
      type: Object,
      default: function () {
        const examples = this
        const simplegrid = {
          get: {
            method: 'get',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
          },
          descriptor: examples.citydescriptor,
          keyfield: 'Id',
          total: 0,
          paging: true,
          resolveresult: (response) => examples.resolveresult(response),
          resolvepayload (payload) {
            return examples.resolvepayload(payload)
          }
        }
        return simplegrid
      }
    },
    filtered: {
      type: Object,
      default: function () {
        const examples = this
        const grid = {
          get: {
            method: 'get',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
          },
          usefilter: true,
          filter: examples.cityfilter,
          descriptor: examples.citydescriptor,
          keyfield: 'Id',
          total: 0,
          paging: true,
          resolveresult: (response) => examples.resolveresult(response),
          resolvepayload (payload) {
            return examples.resolvepayload(payload)
          }
        }
        return grid
      }
    },
    breweries: {
      type: Object,
      default: function () {
        const examples = this
        const breweries = {
          get: {
            method: 'get',
            url: 'https://api.openbrewerydb.org/breweries'
          },
          descriptor: [],
          keyfield: 'id',
          resolveresult (response) {
            const collection = response.data
            Vue.set(examples, 'total', collection.length)
            Vue.set(examples, 'collection', collection)
          }
        }
        return breweries
      }
    },
    source: {
      type: Object,
      default: function () {
        const examples = this
        const source = {
          datafield: 'gridsource',
          text: 'Источник данных',
          input: 'select',
          valuekey: 'key',
          labelkey: 'label',
          values: [
            {
              key: 1,
              label: 'Уже знакомые города',
              grid: examples.simplegrid
            },
            {
              key: 2,
              label: 'Какие-то пивоварни',
              grid: examples.breweries
            }
          ],
          onselect (property, option, parent) {
            Vue.set(examples, 'collection', [])
            Vue.set(examples, 'grid', option.grid)
          }
        }
        return source
      }
    },
    form: {
      type: Object,
      default: function () {
        const examples = this
        const form = {
          descriptor: [examples.source],
          payload: { gridsource: 1 }
        }
        return form
      }
    },
    gridexamples: {
      type: Array,
      default: function () {
        const view = this
        return [
          {
            name: 'simple',
            caption: 'Простой грид',
            grid: view.simplegrid
          },
          {
            name: 'filtered',
            caption: 'Грид с фильтром',
            grid: view.filtered
          },
          {
            name: 'make-your-own-grid-in-5-min',
            caption: 'Сделай свой грид за 5 минут',
            form: view.form,
            grid: view.simplegrid
          }
        ]
      }
    }
  },
  data (view) {
    return {
      infos: CDGrid.mixins.concat(CDGrid),
      currentindex: 0,
      selected: Object,
      grid: {},
      settingform: false,
      total: 0,
      payload: {
        limit: 10,
        minPopulation: null,
        namePrefix: null,
        distanceUnit: null,
        offset: 0,
        countryIds: null
      },
      // gridexamples: ,
      doc: [
        {
          id: 'grid-a',
          header: 'CD-GRID',
          description: ['Что-то будет']
        }
      ],
      collection: []
    }
  },
  watch: {
    currentindex: {
      immediate: true,
      handler (newvalue, oldvalue) {
        const examples = this
        if (newvalue >= 0) {
          const example = examples.gridexamples[newvalue]
          Vue.set(examples, 'collection', [])
          Vue.set(examples, 'settingform', example.form)
          Vue.set(examples, 'grid', example.grid)
        }
      }
    }
  },
  methods: {
    onsettingchanged (property, value) {
      console.log(property, value)
    },
    generateproperties () {
      this.grid.descriptor = []
      const touch = this.collection[0]
      if (touch) {
        for (const [key] of Object.entries(touch)) {
          this.grid.descriptor.push({ datafield: key, text: key })
        }
      }
    },
    resolvepayload (payload) {
      return {
        params: payload
      }
    },
    onfilterchange (property, value) {
      if (property.datafield !== 'region_id') {
        if (property.datafield === 'countryIds') {
          Vue.set(this.grid.get, 'url', 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities')
        }
        Vue.set(this.payload, property.datafield, value)
      }
    },
    selectexample (event, args) {
      this.currentindex = args.index
    },
    resolvetabclass (tab) {
      return tab.name === this.selected.name ? 'nav-item active' : 'nav-item'
    },
    resolveresult (response) {
      Vue.set(this, 'total', response.data.metadata.totalCount)
      Vue.set(this, 'collection', response.data.data)
    },
    onpagechange (event, pageargs) {
      Vue.set(this.payload, 'offset', pageargs.row.offset)
    }
  }
}
</script>

<style>
</style>
