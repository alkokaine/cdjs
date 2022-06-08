<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info v-for="(info, index) in select" :key="index" :component="info" property="props"></cd-info>
    <select v-model="selected" v-on:change="onpropertyselect">
      <option v-for="(option) in examples" :key="option.id" :value="option.id" :label="option.name">{{ option.name }}</option>
    </select>
    <cd-prop-example v-if="property">
      <cd-form slot="editor" :descriptor="options" :payload="property.payload" :onpropertychange="onpropertychange"></cd-form>
      <div slot="preview">
        <code>{{ property.payload }}</code>
        <div v-if="property.params">
          <h3>Давайте издеваться!</h3>
          <div>На форме ниже мы видим значения свойств объекта, который улетит с запросом</div>
          <cd-form :descriptor="property.paramsdescriptor" :payload="property.params" :onpropertychange="onpropertychange"></cd-form>
        </div>
      </div>
      <cd-form slot="sandbox" :descriptor="[property.payload]" :payload="selectform" :onpropertychange="onpropertychange"></cd-form>
    </cd-prop-example>
  </div>
</template>

<script>
import Vue from 'vue'
import CDInfo from '@/generic/cd-doc-component-info.vue'
import CdDocGeneric from '@/generic/cd-doc-generic.vue'
import inputype from '../common/inputtype'
import CDForm from '@/components/cd-form.vue'
import CDSelect from '@/components/cd-select.vue'
import CDPropExample from '@/generic/cd-prop-example.vue'
import readyvaluesoptions from '@/examples/propertyoptions.js'

const countryParams = {
  limit: 10,
  namePrefix: '',
  offset: 0
}

const cityParams = {
  limit: 10,
  minPopulation: null,
  namePrefix: null,
  countryIds: '',
  distanceUnit: null,
  offset: 0,
  excludedCountryIds: null
}

export default {
  components: { 'cd-doc': CdDocGeneric, 'cd-info': CDInfo, 'cd-form': CDForm, 'cd-prop-example': CDPropExample },
  name: 'cd-doc-home',
  data (home) {
    return {
      select: CDSelect.mixins.concat(CDSelect),
      content: [
        {
          id: 'home-1',
          header: 'CDJS',
          description: [
            'CDJS - Common Declarative JavaScript.'
          ],
          info: [
            {
              id: 'home-0-0',
              header: '0?',
              description: [
                ''
              ]
            },
            {
              id: 'home-1-1',
              header: '...',
              description: [
                'Поведение через определение. За этими простыми словами скрывается не менее простая идея'
              ],
              info: [
                {
                  header: 'Какая?',
                  description: [
                    'Мы будем определять объект, который однажды станет аргументами render-функции.'
                  ]
                }
              ]
            },
            {
              id: 'home-1-2',
              header: 'Определение',
              description: [
                'Для начала давайте остановимся на определении и определениях. Пользователь, как правило, имеет дело или со списками каких-то объектов, или со свойствами конкретного объекта.<br/>',
                'В списках объектов пользователю опять же нужны его свойства (иначе зачем это всё).<br/>',
                'Попробуем разобраться, как же можно определить и описать свойство<br/>'
              ]
            },
            {
              id: 'home-1-3',
              header: 'Свойство',
              description: [
                'Свойство объекта. Поле таблицы. Выели мозг золотые синицы<br/>',
                'Лемма: Если объект имеет какое-то свойство, его можно назвать.<br/>',
                'Назовём свойство, значением которого названа колонка в таблице БД, <code><b>datafield</b></code>, а для человеческого названия свойства заведём свойство <code><b>text</b></code> дескриптора, и через него будем управлять тем, что увидит пользователь в заголовке столбца таблицы или рядом с полем формы<br/>',
                'От типа данных свойства, от его назначения, зависит то, каким будет элемент формы или столбец таблицы и как он будет себя вести<br/>'
              ],
              info: [
                {
                  // header: 'Простой <input>',
                  description: [
                    'Для простого отображения свойства объекта данных достаточно определить объект-дескриптор с двумя свойствами: <code><b>text</b></code> и <code><b>datafield</b></code><br/>'
                  ]
                },
                {
                  header: 'Свойство <code><b>type</b></code> объекта-дескриптора',
                  description: [
                    `Для рендеринга элемента <code><b>input</b></code> будем использовать свойство объекта-дескриптора <b>type</b>, которое принимает одно из следующих значений: [${inputype}]<br/>`,
                    'Если в дескрипторе свойство <code><b>type</b></code> не определено, по умолчанию отрисуется обычный текстовый <code><b>input</b></code><br/>',
                    '...тут будет что-то ещё....'
                  ]
                },
                {
                  header: 'Свойство <code><b>select</b></code> объекта-дескриптора',
                  description: [
                    'Для рендеринга элемента <code><b>select</b></code> будем использовать такой объект.</br>',
                    `<pre>
<code>
datafield: String,
text: String,
valuekey: String, // имя свойства, содержащее ключевое значение опций selecta
labelkey: String, // имя свойства, содержащее значение для заголовка опции
url: String, // урл, по которому получим опции
method: String, // метод
resolveresult: Function, // функция (response) => Array, которая возвращает список опций из ответа axios 
isdisabled: Function, // функция (payload, option) => Boolean, которая дисаблит option для свойства datafield объекта payload
params: Function // функция, которая возвращает параметры запроса к url для получения списка опций
</code>
</pre>`
                  ]
                }
              ]
            }
          ]
        }
      ],
      examples: [{
        id: 1,
        name: 'Простой селект с синхронными данными',
        payload: {
          datafield: 'property1',
          text: 'Выберите что-то',
          labelkey: 'labelkey',
          valuekey: 'valuekey',
          input: 'select',
          clearable: true,
          values: [{ labelkey: 'label key 1', valuekey: 1 }, { labelkey: 'label key 2', valuekey: 2 }, { labelkey: 'label key 3', valuekey: 3 }]
        },
        paramsdescriptor: []
      }, {
        id: 2,
        name: 'Асинхронный селект, получающий данные по url',
        payload: {
          datafield: 'wikiDataId',
          text: 'Страна',
          input: 'select',
          valuekey: 'wikiDataId',
          labelkey: 'name',
          url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          },
          slotdescriptor: [
            {
              datafield: 'code'
            },
            {
              datafield: 'name'
            },
            {
              datafield: 'wikiDataId'
            }
          ],
          method: 'get',
          resolveresult: (response) => response.data.data,
          resolvepayload: home.resolveCountryPayload,
          isdisabled: (option, payload, parent) => option.wikiDataId.endsWith(7)
        },
        params: countryParams,
        paramsdescriptor: [
          {
            datafield: 'limit',
            text: 'limit'
          },
          {
            datafield: 'namePrefix',
            text: 'namePrefix'
          }
        ]
      }, {
        id: 3,
        name: 'Ещё один селект, получающий данные по url',
        payload: {
          datafield: 'id',
          text: 'Город',
          url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
          headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000', 'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com' },
          method: 'get',
          input: 'select',
          labelkey: 'city',
          valuekey: 'id',
          resolveresult: (response) => response.data.data,
          resolvepayload: home.resolveCityPayload
        },
        paramsdescriptor: [
          {
            datafield: 'offset',
            text: 'offset'
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
            headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000', 'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com' },
            method: 'get',
            slotdescriptor: [
              {
                datafield: 'wikiDataId'
              }
            ],
            resolveresult: (response) => response.data.data,
            resolvepayload: home.resolveCountryPayload,
            isdisabled: (option, payload, parent) => option.wikiDataId.endsWith(7),
            onselect: (payload, option) => {
              if (option) Vue.set(payload, 'countryIds', `${option.code},`)
            }
          },
          {
            datafield: 'countryIds',
            text: 'countryIds'
          }
        ],
        params: cityParams
      }],
      property: false,
      selected: 1,
      options: readyvaluesoptions,
      selectform: {
        property1: 1
      },
      payload: false
    }
  },
  watch: {
    selected: {
      immediate: true,
      handler (newvalue) {
        if (newvalue) {
          this.property = this.examples.find(e => e.id === newvalue)
        }
      }
    }
  },
  methods: {
    onpropertychange (...args) {
      // console.log(args)
    },
    onpropertyselect (event) {
      this.selected = Number(event.target.value)
    },
    resolveCityPayload (payload) {
      return {
        params: this.property.params
      }
    },
    resolveCountryPayload (payload) {
      return {
        params: this.property.params
      }
    }
  }
}
</script>

<style>

</style>
