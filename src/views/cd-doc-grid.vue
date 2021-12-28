<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-tabs class="examples-list" :tabs="gridexamples" keyfield="name" :current="currentindex" :ontabselected="selectexample">
        <cd-grid class="example-grid" v-if="selected" keyfield="id"
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
          <div slot="grid-tuner">
            <cd-descriptor-editor v-if="selected.filter" :descriptor="selected.filter">
              <div class="editor-header" slot="editor-header">
                <span>Опишем свойства фильтра вот таким массивом объектов</span>
              </div>
            </cd-descriptor-editor>
            <cd-form v-if="selected.usefilter" class="cd-grid--filter" :descriptor="selected.filter"
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
import CDDescriptorEditor from '../generic/cd-descriptor-editor.vue'
export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric,
    'cd-info': ComponentInfo,
    'cd-grid': CDGrid,
    'cd-form': CDForm,
    'cd-tabs': CDTabs,
    'cd-descriptor-editor': CDDescriptorEditor
  },
  props: {
    gridexamples: {
      type: Array,
      default: function () {
        const view = this
        return [
          {
            name: 'simple',
            caption: 'Простой грид',
            get: {
              method: 'get',
              url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
            },
            collection: [],
            total: 0
          },
          {
            name: 'filtered',
            caption: 'Грид с фильтром',
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
        ]
      }
    }
  },
  data (view) {
    return {
      infos: CDGrid.mixins.concat(CDGrid),
      currentindex: 0,
      selected: Object,
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
      // gridexamples: ,
      doc: [
        {
          id: 'grid-a',
          header: 'CD-GRID',
          description: ['Что-то будет']
        }
      ]
    }
  },
  watch: {
    currentindex: {
      immediate: true,
      handler (newvalue, oldvalue) {
        if (newvalue >= 0) {
          this.selected = this.gridexamples[newvalue]
        }
      }
    }
  },
  methods: {
    onfilterchange (property, value) {
      Vue.set(this.payload, property.datafield, value)
    },
    selectexample (event, args) {
      this.currentindex = args.index
    },
    resolvepayload (payload) {
      return {
        params: payload
      }
    },
    resolvetabclass (tab) {
      return tab.name === this.selected.name ? 'nav-item active' : 'nav-item'
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
