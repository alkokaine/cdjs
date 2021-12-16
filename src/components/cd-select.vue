<template>
  <select v-model="current" class="cd-select form-control form-control-sm" v-on:input="oninput">
    <option v-if="error" value="reload" :label="error"/>
    <option v-for="(option) in collection" :key="option[keyfield]" :value="option[keyfield]" :label="option[labelkey]" :disabled="isdisabled(option)"/>
  </select>
</template>

<script>
import collection from '../common/collection'
export default {
  name: 'cd-select',
  mixins: [collection],
  props: {
    isdisabled: {
      type: Function,
      default: function (option, paylad) {
        return false
      },
      description: 'Функция, которая вычисляет disabled для option и payload'
    },
    clearable: { type: Boolean, default: true, description: 'Есть ли рядом с select кнопка очистки выбранной опции' },
    keyfield: { type: String, required: true, description: 'Свойство-идентификатор объектов в опциях select' },
    labelkey: { type: String, required: true, description: 'Свойство-заголовок объектов в опциях select' },
    value: { type: [Number, String], description: 'Текущее значение select' },
    onselect: { type: Function, required: true, description: 'Что произойдёт по выбору опции' }
  },
  data (select) {
    return {
      current: select.value
    }
  },
  methods: {
    oninput (event) {
      if (event.target.value === 'reload') this.loaddata(this.payload)
      const selected = this.collection.find(option => String(option[this.keyfield]) === event.target.value)
      if (selected !== null && selected !== undefined) {
        this.current = selected[this.keyfield]
        this.onselect(selected)
      }
    }
  }
}
</script>

<style>

</style>
