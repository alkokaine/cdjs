<template>
  <select :value="current" class="cd-select form-control form-select-sm" v-on:input="oninput">
    <template v-if="error">
      <option v-if="error" value="reload" :label="error"/>
    </template>
    <template v-else>
      <option v-for="(option) in collection" :key="option[keyfield]" :value="option[keyfield]" :label="option[labelkey]" :disabled="isdisabled(option)"/>
    </template>
  </select>
</template>

<script>
import collection from '../common/collection'
import watchurl from '../common/get-url-watch'
export default {
  name: 'cd-select',
  mixins: [collection, watchurl],
  props: {
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
  watch: {
    value: {
      immediate: true,
      handler (newvalue) {
        this.current = newvalue
      }
    }
  },
  data (select) {
    return {
      current: select.value
    }
  },
  methods: {
    oninput (event) {
      if (event.target.value === 'reload') this.loaddata(this.get.url, this.payload)
      const selected = this.collection.find(option => String(option[this.keyfield]) === event.target.value)
      if (selected !== null && selected !== undefined) {
        this.current = selected[this.keyfield]
      } else {
        this.current = event.target.value
      }
      this.onselect(selected)
    }
  }
}
</script>

<style>

</style>
