<template>
  <select v-model="selectvalue" class="cd-select form-control form-control-sm" v-on:input="oninput">
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
    isdisabled: { type: Function },
    keyfield: { type: String, required: true },
    labelkey: { type: String, required: true },
    value: { type: [Number, String] }
  },
  data (select) {
    return {
      selectvalue: select.value
    }
  },
  methods: {
    oninput (event) {
      if (event.target.value === '-1') this.loaddata(this.payload)
    }
  }
}
</script>

<style>

</style>
