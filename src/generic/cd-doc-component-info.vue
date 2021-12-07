<template>
  <cd-grid keyfield="propertyname" :collection="data" :descriptor="descriptor"></cd-grid>
</template>

<script>
import CDGrid from '../components/cd-grid.vue'

export default {
  components: {
    'cd-grid': CDGrid
  },
  props: {
    component: { type: Object, required: true },
    property: { type: String, required: true }
  },
  data (info) {
    return {
      data: Array.from(Object.keys(info.component[info.property])).map(pname => ({
        propertyname: pname,
        value: info.component[pname]
      })),
      descriptor: [
        {
          datafield: 'propertyname',
          text: 'PropertyName'
        }
      ]
    }
  }
}
</script>

<style>

</style>
