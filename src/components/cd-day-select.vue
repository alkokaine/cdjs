<template>
  <cd-form :payload="{}" :descriptor="descriptor">
    <div slot="header" class="day-selector--header"></div>
    <cd-month slot="footer" slot-scope="{ model }" :template="resolveTemplate(model)" :date="scheduler.mdate" :selected-days="selected"
      :compact="true" :prepend-days="false" :multiple="true">
      <div slot="month-footer" slot-scope="{ selected }" class="text-end">
        <button class="btn btn-sm btn-outline-secondary mx-2" v-on:click="reset">Отменить</button>
        <button class="btn btn-sm btn-primary mx-2" v-on:click="submit({ $event, payload: selected })">Применить</button>
      </div>
    </cd-month>
  </cd-form>
</template>

<script>
import CDForm from './cd-form'
import CDMonth from './cd-month'
const defaultTemplates = [
  {
    function: (date) => {
      return true
    },
    key: 101,
    label: 'Весь месяц'
  },
  {
    function: ({ code }) => {
      return code == 0 || code == 2
    },
    key: 102,
    label: 'Все рабочие дни'
  },
  {
    function: ({ code }) => {
      return code == 1
    },
    key: 103,
    label: 'Все выходные дни'
  },
  {
    function: ({ date }) => {
      return date.date() % 2 == 0
    },
    key: 104,
    label: 'Чётные дни месяца'
  },
  {
    function: ({ date }) => {
      return date.date() % 2 == 1
    },
    key: 105,
    label: 'Нечётные дни месяца'
  },
  {
    function: ({ date }) => {
      return date.day() % 2 == 0 && date.day() != 0
    },
    key: 106,
    label: 'Чётные дни недели'
  },
  {
    function: ({ date }) => {
      return (date.day()) % 2 == 1 || date.day() == 0
    },
    key: 107,
    label: 'Нечётные дни недели'
  }
]
const timeformatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' })

export default {
  name: 'cd-day-select',
  components: {
    'cd-form': CDForm,
    'cd-month': CDMonth
  },
  props: {
    date: { type: [Date, String, Number], required: true },
    selected: { type: Array },
    submit: { type: Function },
    reset: { type: Function },
    templates: { type: Array, returns: Boolean, description: 'Массив объектов вида { key: Number, label: String, function: Function } где function -- функция от даты, возвращающая true или false' },
  },
  data ({ templates, date }) {
    return {
      scheduler: {
        mdate: new Date(date)
      }
    }
  },
  computed: {
    resolveTemplate ({ templateList }) {
      return ({ template_id }) => ((templateList.find(t => t.key == template_id)) || {}).function
    },
    templateList ({ templates }) {
      return (templates || []).concat(defaultTemplates)
    },
    templateSelector ( { templateList }) {
      return  {
          text: 'Шаблон',
          datafield: 'template_id',
          input: 'select',
          valuekey: 'key',
          labelkey: 'label',
          clearable: true,
          values: templateList
        }
    },
    descriptor ({ templateSelector }) {
      return [templateSelector]
    }
  }
}
</script>

<style>

</style>