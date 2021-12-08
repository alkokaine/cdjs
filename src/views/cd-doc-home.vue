<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info v-for="(info, index) in select" :key="index" :component="info" property="props"></cd-info>
    <cd-prop-example :property="selectexample" :options="options" :convertproperty="convertproperty" :payload="selectform"></cd-prop-example>
  </div>
</template>

<script>
import CDInfo from '../generic/cd-doc-component-info.vue'
import CdDocGeneric from '../generic/cd-doc-generic.vue'
import inputype from '../common/inputtype'
import CDSelect from '../components/cd-select.vue'
import CDPropExample from '../generic/cd-prop-example.vue'
export default {
  components: { 'cd-doc': CdDocGeneric, 'cd-info': CDInfo, 'cd-prop-example': CDPropExample },
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
              id: 'home-1-1',
              header: 'Начнём',
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
                    'Для рендеринга элемента <code><b>select</b></code> будем использовать свойство объекта-дескриптора <b>select</b>.</br>',
                    `<pre>
<code>
datafield: String,
text: String,
select: {
  valuekey: String, // имя свойства, содержащее ключевое значение опций selecta
  labelkey: String, // имя свойства, содержащее значение для заголовка опции
  url: String, // урл, по которому получим опции
  method: String, // метод
  resolveresult: Function, // функция (response) => Array, которая возвращает список опций из ответа axios 
  isdisabled: Function, // функция (payload, option) => Boolean, которая дисаблит option для свойства datafield объекта payload
  params: Function // функция, которая возвращает параметры запроса к url для получения списка опций
}
</code>
</pre>`
                  ]
                }
              ]
            }
          ]
        }
      ],
      selectexample: {
        datafield: 'property1',
        text: 'Выберите что-то',
        labelkey: 'labelkey',
        valuekey: 'valuekey',
        url: 'url',
        values: [{ labelkey: 'label key 1', valuekey: 1 }, { labelkey: 'label key 2', valuekey: 2 }, { labelkey: 'label key 3', valuekey: 3 }],
        method: 'method',
        resolveresult: (response) => response.data,
        isdisabled: 'isdisabled',
        params (payload) {
          return payload
        },
        onselect (...args) {
          console.log(args)
        }
      },
      options: [
        {
          datafield: 'datafield',
          text: 'Имя свойства объекта'
        },
        {
          datafield: 'text',
          text: 'Человеческое имя свойства'
        },
        {
          text: 'select',
          descriptor: [
            {
              datafield: 'labelkey',
              text: 'labelkey'
            },
            {
              datafield: 'valuekey',
              text: 'valuekey'
            },
            {
              datafield: 'url',
              text: 'url'
            },
            {
              datafield: 'method',
              text: 'method'
            },
            {
              datafield: 'resolveresult',
              text: 'resolveresult'
            },
            {
              datafield: 'isdisabled',
              text: 'isdisabled'
            },
            {
              datafield: 'params',
              text: 'params'
            }
          ]
        }
      ],
      selectform: {
        property1: 1
      }
    }
  },
  methods: {
    convertproperty (property) {
      const p = property
      return {
        datafield: p.datafield,
        text: p.text,
        select: {
          labelkey: p.labelkey,
          valuekey: p.valuekey,
          crud: {
            get: {
              url: p.url,
              method: p.method
            }
          },
          values: p.values,
          resolveresult: p.resolveresult,
          isdisabled: p.isdisabled,
          params: p.params,
          onselect: p.onselect
        }
      }
    }
  }
}
</script>

<style>

</style>
