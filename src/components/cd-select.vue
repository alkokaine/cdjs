<template>
  <div class="cd-select">
      <select>
        <option v-for="(option) in list" :key="option[keyfield]" :value="option[keyfield]" :label="option[labelkey]"/>
      </select>
  </div>
</template>

<script>
import collection from '../common/collection'
export default {
  name: 'cd-select',
  mixins: [collection],
  props: {
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
