<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
    <cd-tabs class="examples-list" :tabs="gridexamples" keyfield="name" :current="currentindex" :ontabselected="selectexample">
      <div>
        <cd-form v-if="settingform" :descriptor="settingform.descriptor" :payload="settingform.payload" :onpropertychange="onsettingchanged"></cd-form>
        <cd-grid v-if="grid" class="example-grid" ref="example" :keyfield="grid.keyfield" :headers="grid.headers"
          :get="grid.get"
          :payload="payload"
          :descriptor="grid.descriptor"
          :resolveresult="grid.resolveresult"
          :resolvepayload="grid.resolvepayload"
          :collection="collection"
          :selectrows="true"
          :total="total"
          :paging="grid.paging"
          :pageSize="10"
          :onpagechange="onpagechange">
          <div slot="grid-tuner">
            <div v-if="currentindex === 2">
              <cd-list v-if="step >= 0 && tutorial[step]" :collection="tutorial[step].buttons" keyfield="id">
                <div slot="header">
                  <div v-for="(text, index) in tutorial[step].text" :key="index">{{ text }}</div>
                  <cd-prop-list v-if="tutorial[step].descriptor" :descriptor="tutorial[step].descriptor()" :onremoveproperty="onremoveproperty" :popoff="step < 4"></cd-prop-list>
                </div>
                <button class="btn btn-sm" slot-scope="button" v-on:click.stop="button.row.click" :disabled="isbuttondisabled(button)">{{ button.row.text }}</button>
              </cd-list>
            </div>
            <cd-form v-if="grid.usefilter" class="cd-grid--filter" :descriptor="grid.filter" :sync="true"
              :payload="payload"
              :inline="true"
              :onpropertychange="onfilterchange">
            </cd-form>
          </div>
          <template slot-scope="scope">
            <template v-if="!scope.property">
              <template>
                <template v-if="scope.start">
                  <span></span>
                </template>
                <template v-else-if="scope.end">
                  <span></span>
                </template>
                <template v-else-if="scope.data.row">
                  {{ scope.data.row }}
                </template>
              </template>
            </template>
          </template>
        </cd-grid>
      </div>
    </cd-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import CDDocGeneric from '@/generic/cd-doc-generic.vue'
import ComponentInfo from '@/generic/cd-doc-component-info.vue'
import CDGrid from '@/components/cd-grid.vue'
import CDForm from '@/components/cd-form.vue'
import CDTabs from '@/components/cd-tabs.vue'
import CDList from '@/components/cd-list.vue'
import CDPropList from '@/generic/cd-prop-list.vue'
export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric,
    'cd-info': ComponentInfo,
    'cd-grid': CDGrid,
    'cd-form': CDForm,
    'cd-list': CDList,
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
    countrydd: {
      type: Object,
      default: function () {
        const view = this
        return {
          datafield: 'countryIds',
          text: 'Страна',
          input: 'select',
          valuekey: 'code',
          labelkey: 'name',
          url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
          headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000', 'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com' },
          method: 'get',
          resolvepayload: (payload) => ({
            params: {
              offset: 0,
              limit: 10
            }
          }),
          resolveresult: (response) => response.data.data,
          isdisabled: (payload, option) => option !== undefined && (option.wikiDataId || '').endsWith(7),
          onselect: (payload, option, parent) => {
            if (option) {
              const region = parent.descriptor.find(p => p.datafield === 'region_id')
              Vue.set(region, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${option.code}/regions`)
              Vue.set(view.grid.get, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${option.code}`)
            } else {
              Vue.set(view.grid.get, 'url', 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities')
            }
          }
        }
      }
    },
    regiondd: {
      type: Object,
      default: function () {
        const view = this
        return {
          datafield: 'region_id',
          text: 'regions',
          input: 'select',
          valuekey: 'wikiDataId',
          labelkey: 'name',
          url: '',
          method: 'get',
          resolveresult: (response) => response.data.data,
          resolvepayload: (payload) => ({
            params: {
              offset: 0,
              limit: 10
            }
          }),
          headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000', 'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com' },
          isdisabled: (payload, option) => option !== undefined && (option.wikiDataId || '').endsWith(7),
          onselect (payload, option, descriptor) {
            if (option) Vue.set(view.grid.get, 'url', `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${option.countryCode}/regions/${option.isoCode}/cities`)
          }
        }
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
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
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
    // filtered: {
    //   type: Object,
    //   default: function () {
    //     const examples = this
    //     const grid =
    //     return grid
    //   }
    // },
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
            Vue.set(examples, 'grid', this.values.find(v => v.key === option))
            Vue.set(examples, 'step', 0)
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
    }
    // ,
    // gridexamples: {
    //   type: Array,
    //   default: function () {
    //     const view = this
    //     return
    //   }
    // }
  },
  data (view) {
    const increase = () => { Vue.set(view, 'step', view.step + 1) }
    return {
      infos: CDGrid.mixins.concat(CDGrid),
      currentindex: 0,
      selected: Object,
      preview: [],
      tutorial: [
        {
          text: ['Итак, мы получили из урл json данные, отображаемые в гриде. Но выглядит это не совсем так, как мы хотим, правда?'],
          buttons: [
            {
              id: 1,
              text: 'Давайте добавим колонки!',
              click (event) {
                increase()
              }
            }
          ]
        },
        {
          text: ['Мы можем сгенерировать колонки автоматически и посмотреть что получится.'],
          buttons: [
            {
              id: 1,
              text: 'Сгенерировать колонки автоматически',
              click (event) {
                increase()
                view.generateproperties()
              }
            }
          ]
        },
        {
          text: ['Наш художник-декоратор сгенерировал из свойств объектов коллекции следующие колонки:'],
          descriptor: () => view.preview,
          buttons: [
            {
              id: 1,
              text: 'Применить полученные колонки к гриду',
              click (event) {
                Vue.set(view.grid, 'descriptor', view.preview)
              }
            },
            {
              id: 2,
              text: 'Идём дальше',
              click (event) {
                increase()
              },
              isdisabled: () => view.grid.descriptor === null || view.grid.descriptor === undefined || view.grid.descriptor.length === 0
            }
          ]
        },
        {
          text: ['Что ж, почти неплохо! Но нужны ли нам все эти колонки? Попробуйте избавиться от них с помощью крестика возле названия свойства'],
          descriptor: () => view.grid.descriptor,
          buttons: [
            {
              id: 1,
              text: 'Вперёд!',
              click (event) {
                increase()
              },
              isdisabled: () => !view.hasremoved
            }
          ]
        },
        {
          text: [
            'Займёмся заголовками. Попробуйте нажать на название свойства в списке ниже. Откроется подсказка, содержащая редактор дескриптора свойства',
            'Свойство datafield будет задисаблено, чтобы не поломать связи между свойствами строк таблицы и не получить в результате пустой столбец',
            'Свойство text будет содержать строчку, которая отрисуется в заголовке столбца таблицы'],
          descriptor: () => view.grid.descriptor
        }
      ],
      step: Number,
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
      gridexamples: [
        {
          name: 'simple',
          caption: 'Простой грид',
          grid: view.simplegrid
        },
        {
          name: 'filtered',
          caption: 'Грид с фильтром',
          grid: {
            get: {
              method: 'get',
              url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities'
            },
            headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000', 'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com' },
            usefilter: true,
            filter: [
              view.countrydd,
              view.regiondd
            ],
            descriptor: view.citydescriptor,
            keyfield: 'Id',
            total: 0,
            paging: true,
            resolveresult: (response) => view.resolveresult(response),
            resolvepayload (payload) {
              return view.resolvepayload(payload)
            }
          }
        },
        {
          name: 'make-your-own-grid-in-5-min',
          caption: 'Сделай свой грид за 5 минут',
          form: view.form,
          grid: view.simplegrid
        }
      ],
      doc: [
        {
          id: 'grid-a',
          header: 'CD-GRID',
          description: ['Что-то будет']
        }
      ],
      collection: [],
      hasremoved: false
    }
  },
  computed: {
    isbuttondisabled () {
      return (button) => Object.prototype.hasOwnProperty.call(button.row, 'isdisabled') ? button.row.isdisabled() : false
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
    onsettingchanged (propertyholder, property, value) {
      console.log(property, value)
    },
    generateproperties () {
      const touch = this.collection[0]
      this.preview = []
      if (touch) {
        for (const [key] of Object.entries(touch)) {
          this.preview.push({ datafield: key, text: key })
        }
      }
    },
    resolvepayload (payload) {
      return {
        params: payload
      }
    },
    onfilterchange (propertyholder, property, value) {
      if (property.datafield === 'countryIds') {
        Vue.set(this.grid.get, 'url', 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities')
      }
      // if (property.datafield !== 'region_id') {
      //   if (property.datafield === 'countryIds') {
      //     Vue.set(this.grid.get, 'url', 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities')
      //   }
      //   Vue.set(this.payload, property.datafield, value)
      // }
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
    onpagechange (newpage) {
      Vue.set(this.payload, 'offset', (newpage.page - 1) * newpage.pageSize)
    },
    onremoveproperty (property) {
      this.hasremoved = true
    }
  }
}
</script>

<style>
</style>
