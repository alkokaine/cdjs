<template>
  <cd-list :collection="descriptor" keyfield="datafield" listclass="list-unstyled m-0 text-start" :showitems="hasdata">
    <span v-if="!hasdata" slot="header">
      н/д
    </span>
    <template slot-scope="prop">
      <cd-props v-if="prop.row.descriptor" :descriptor="prop.row.descriptor" :payload="payload" :class="prop.row.class"></cd-props>
      <div v-else-if="prop.row.datafield" class="cd-prop" :class="prop.row.class">{{ payload[prop.row.datafield] }}</div>
    </template>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
export default {
  name: 'cd-props',
  props: {
    descriptor: { type: Array, required: true },
    payload: { type: Object }
  },
  components: {
    'cd-list': CDList
  },
  data (props) {
    return {
      hasdata: props.payload !== null && props.payload !== undefined
    }
  }
}
</script>

<style>

</style>
