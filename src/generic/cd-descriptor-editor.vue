<template>
  <cd-list class="cd-descriptor-editor" :collection="descriptor" keyfield="datafield"  :listitemclicked="selectproperty" listclass="property-list" rowclass="cd-code--example">
    <cd-form slot="header" :descriptor="propertydescriptor" :payload="selected" :onpropertychange="updateproperty" class="property-editor"></cd-form>
    <div class="card" slot-scope="scope">
      <code class="card-body">{{ scope.row }}</code>
    </div>
  </cd-list>
</template>

<script>
import options from '../examples/propertyoptions'
import CDList from '../components/cd-list.vue'
import CDForm from '../components/cd-form.vue'

export default {
  name: 'cd-descriptor-editor',
  props: {
    descriptor: { type: Array, required: true }
  },
  components: {
    'cd-list': CDList,
    'cd-form': CDForm
  },
  data (editor) {
    return {
      propertydescriptor: options,
      selected: editor.descriptor[0]
    }
  },
  methods: {
    selectproperty (event, args) {
      this.selected = args.row
    },
    updateproperty (property, value) {
      this.selected[property.datafield] = value
    }
  }
}
</script>

<style>
  .cd-code--example {
    white-space: pre-wrap;
    width: 250px;
    display: block;
    margin: 10px;
  }
  .property-editor {
    width: 30%;
  }
  .property-list {
    width: 70%;
    display: flex;
    flex-wrap: wrap;
  }
  .cd-descriptor-editor {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }
</style>
