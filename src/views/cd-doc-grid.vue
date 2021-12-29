<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-tabs class="examples-list" :tabs="gridexamples" keyfield="name" :current="currentindex" :ontabselected="selectexample">
        <cd-grid class="example-grid" v-if="isselected" :keyfield="selected.keyfield"
          :key="selected.name"
          :get="selected.get"
          :payload="payload"
          :descriptor="selected.descriptor"
          :resolveresult="selected.resolveresult"
          :collection="selected.collection"
          :total="selected.total"
          :paging="true"
          :pageSize="10"
          :resolvepayload="resolvepayload"
          :onpagechange="onpagechange">
          <div slot="grid-tuner">
            <cd-descriptor-editor v-if="selected.filter && !selected.noedit" :descriptor="selected.filter">
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
// const api = {
//   'Application Id': '84b4d2ad-2779-40cd-91f1-14b50f71f744',
//   'Application Secret': '649fd0b1a90b5c149e5e066b1e3b996d77e95bf302075e9be0082200101a6e83a1423604a257a55610ce1ba69a5bb0dca76f4e6c278fb33972c6daad01b557fc79704fedc8df093e9c312ecd189fe6ab27c22cb748a50174f35f6b00abea2a52056773d92ebd818421f2faedd474eb50'
// }
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
        const descriptor = [
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
        return [
          {
            name: 'simple',
            caption: 'Простой грид',
            get: {
              method: 'get',
              url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
            },
            keyfield: 'Id',
            collection: [],
            descriptor,
            total: 0,
            resolveresult: (response) => {
              view.resolveresult(response)
            }
          },
          {
            name: 'filtered',
            keyfield: 'Id',
            caption: 'Грид с фильтром',
            descriptor,
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
            collection: [],
            resolveresult: (response) => {
              view.resolveresult(response)
            }
          },
          {
            name: 'make-your-own-grid-in-5-min',
            caption: 'Сделай свой грид за 5 минут',
            collection: [],
            keyfield: '',
            total: 0,
            filter: [
              {
                datafield: 'gridsource',
                text: 'Источник данных для грида',
                input: 'select',
                valuekey: 'key',
                labelkey: 'label',
                values: [
                  {
                    key: 1,
                    method: 'get',
                    keyfield: 'Id',
                    descriptor,
                    url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
                    label: 'Уже знакомые города',
                    resolveresult: (response) => {
                      view.resolveresult(response)
                    }
                  },
                  {
                    key: 2,
                    method: 'get',
                    descriptor: [],
                    url: 'https://api.openbrewerydb.org/breweries',
                    keyfield: 'id',
                    resolveresult: (response) => {
                      const collection = response.data
                      const descriptor = view.selected.descriptor
                      if (descriptor === undefined || descriptor.length === 0) {
                        const touch = collection[0]
                        const d = []
                        for (const [key] of Object.entries(touch)) {
                          d.push({ datafield: key, text: key })
                        }
                        Vue.set(view.selected, 'descriptor', d)
                      }
                      delete view.selected.total
                      Vue.set(view.selected, 'collection', collection)
                    },
                    label: 'пивоварни'
                  },
                  {
                    key: 3,
                    method: 'get',
                    label: 'Мои коммиты в гитхаб',
                    descriptor: [],
                    url: 'https://'
                  }
                ],
                onselect (payload, option) {
                  Vue.set(view.selected, 'collection', [])
                  Vue.set(view.selected, 'descriptor', [])
                  Vue.set(view.selected, 'keyfield', option.keyfield)
                  Vue.set(view.selected.get, 'method', option.method)
                  Vue.set(view.selected, 'descriptor', option.descriptor)
                  Vue.set(view.selected, 'resolveresult', option.resolveresult)
                  Vue.set(view.selected.get, 'url', option.url)
                }
              }
            ],
            usefilter: true,
            noedit: true,
            get: {
              method: 'get',
              url: ''
            }
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
        this.isselected = false
        if (newvalue >= 0) {
          this.selected = this.gridexamples[newvalue]
          this.isselected = true
        }
      }
    }
  },
  computed: {
    resolvedescriptor () {
      if (this.selected.descriptor) return this.selected.descriptor
      return this.descriptor
    }
  },
  methods: {
    onfilterchange (property, value) {
      // Vue.set(this.payload, property.datafield, value)
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
