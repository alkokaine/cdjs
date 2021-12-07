<template>
  <select :value="selectvalue" class="cd-select form-control form-control-sm" v-on:input="oninput">
    <option v-if="error" :value="-1" :label="error"/>
    <option v-for="(option) in list" :key="option[keyfield]" :value="option[keyfield]" :label="option[labelkey]" :disabled="isdisabled(option)"/>
  </select>
</template>

<script>
import collection from '../common/collection'
export default {
  name: 'cd-select',
  mixins: [collection],
  props: {
    selected: { type: [Number, Array] },
    isdisabled: {
      type: Function,
      default: function (option, paylad) {
        return false
      },
      description: 'Функция, которая вычисляет disabled для option и payload'
    },
    keyfield: { type: String, required: true, description: 'Свойство-идентификатор объектов в опциях select' },
    labelkey: { type: String, required: true, description: 'Свойство-заголовок объектов в опциях select' },
    value: { type: [Number, String], description: 'Текущее значение select' },
    onselect: { type: Function, required: true, description: 'Что произойдёт по выбору опции' }
  },
  data (select) {
    return {
    }
  },
  methods: {
    oninput (event) {
      if (event.target.value === '-1') this.loaddata(this.payload)
      const selected = this.list.find(option => String(option[this.keyfield]) === event.target.value)
      this.onselect(selected)
    }
  }
}
</script>

<style>

</style>
