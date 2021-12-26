<template>
  <cd-list class="cd-descriptor-editor" :collection="descriptor" keyfield="datafield"  :listitemclicked="selectproperty">
    <cd-form slot="header" :descriptor="propertydescriptor" :payload="selected"></cd-form>
    <code slot-scope="scope">{{ scope.row }}</code>
  </cd-list>
</template>

<script>
import options from '../examples/propertyoptions'
import CDList from '../components/cd-list.vue'

export default {
  name: 'cd-descriptor-editor',
  props: {
    descriptor: { type: Array, required: true }
  },
  components: {
    'cd-list': CDList
  },
  data (editor) {
    return {
      propertydescriptor: options,
      selected: editor.descriptor[0]
    }
  },
  methods: {
    selectproperty (event, args) {
      console.log(event, args)
    }
  }
}
</script>

<style>

</style>
