<template>
  <cd-list :collection="descriptor" keyfield="datafield" listclass="list-unstyled">
    <div slot-scope="prop">
      <template v-if="prop.row.descriptor">
        <cd-props :descriptor="prop.row.descriptor" :payload="payload"></cd-props>
      </template>
      <template v-else-if="prop.row.datafield">
        {{ payload[prop.row.datafield] }}
      </template>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
export default {
  name: 'cd-props',
  props: {
    descriptor: { type: Array, required: true },
    payload: { type: Object, required: true }
  },
  components: {
    'cd-list': CDList
  }
}
</script>

<style>

</style>
