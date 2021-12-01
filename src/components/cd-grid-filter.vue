<template>
  <cd-form :descriptor="descriptor" :payload="payload">
    <slot></slot>
  </cd-form>
</template>

<script>
import CDForm from './cd-form.vue'
import props from '../common/property-decorator'

export default {
  name: 'cd-filter',
  props: {
    payload: { type: Object }
  },
  mixins: [props],
  components: {
    'cd-form': CDForm
  }
}
</script>

<style>

</style>
