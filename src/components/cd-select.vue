<template>
  <div class="cd-select">
      <select>
        <option v-for="(option) in list" :key="option[keyfield]" :value="option[keyfield]" :label="option[labelkey]" :disabled="isdisabled(option)"/>
      </select>
      <template v-if="error">
        <span v-on:click="loaddata(payload)">{{ error }}</span>
      </template>
  </div>
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
    labelkey: { type: String, required: true }
  },
  data (select) {
    return {
    }
  }
}
</script>

<style>

</style>
