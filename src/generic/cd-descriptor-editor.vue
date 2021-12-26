<template>
  <cd-list class="cd-descriptor-editor" :collection="descriptor" keyfield="datafield"  :listitemclicked="selectproperty" listclass="property-list" rowclass="cd-code--example">
    <div class="editor-header--wrap" slot="header">
      <slot name="editor-header"></slot>
    </div>
    <div class="card" slot-scope="scope">
      <div class="card-body">
        <code class="card-body property-code">{{ scope.row }}</code>
        <cd-descriptor-editor v-if="scope.row.descriptor" :descriptor="scope.row.descriptor"></cd-descriptor-editor>
      </div>
    </div>
    <cd-form slot="footer" :descriptor="propertydescriptor" :payload="selected" :onpropertychange="updateproperty" class="property-editor" :inline="true">
      <div slot="header">Здесь можно отредактировать объект-дескриптор</div>
    </cd-form>
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
  .property-code {
    cursor: pointer!important;
  }
  .cd-code--example {
    white-space: pre-wrap;
    display: block;
    margin: 10px;
    flex-grow: 1;
  }
  .property-editor {
  }
  .property-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding-inline-start: unset;
  }
  .cd-descriptor-editor {
    display: block;
    width: 100%;
  }
</style>
