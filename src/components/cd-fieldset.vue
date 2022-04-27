<template>
  <fieldset class="cd-fieldset d-block w-auto">
      <slot></slot>
      <cd-list :listclass="['list-unstyled cd-fieldset--inner', innerclass, { 'ms-2 me-2': inner }]" keyfield="datafield" :rowclass="['cd-field--wrap', { 'ps-2 pe-2 inner': inner }]" :isrowvisible="isvisible" :collection="descriptor">
        <div class="d-block cd-fieldset--header w-auto" slot="header"><slot name="legend"></slot></div>
        <template slot-scope="{ row }">
          <template v-if="row.descriptor">
            <cd-fieldset :descriptor="row.descriptor" :isvisible="isvisible" :isdisabled="isdisabled" :parent="row" :resolvevalue="resolvevalue" :innerclass="row.class">
              <legend v-if="haslegend(row)" slot="legend" class="cd-legend">
                <span class="w-auto ms-4 cd-legend--text ps-2 pe-2">{{ row.text }}</span>
              </legend>
              <template slot-scope="{ property }">
                <slot :property="property" :parent="row"/>
              </template>
            </cd-fieldset>
          </template>
          <template v-else>
            <slot :property="row" :parent="parent"></slot>
          </template>
        </template>
      </cd-list>
    </fieldset>
</template>

<script>
import props from '../common/property-decorator'
import list from './cd-list.vue'
export default {
  name: 'cd-fieldset',
  mixins: [props],
  props: {
    parent: { type: Object },
    inner: { type: Boolean, default: false },
    resolvevalue: { type: Function, required: true },
    isdisabled: { type: Function, default: (property) => (false) },
    isvalid: { type: Function, default: (property) => (false) },
    innerclass: { type: [String, Array] }
  },
  components: {
    'cd-list': list
  },
  computed: {
    hasdescriptor () {
      return (property) => Object.prototype.hasOwnProperty.call(property, 'descriptor') && Array.isArray(property.descriptor) && property.descriptor.length
    },
    haslegend () {
      return (property) => (property === undefined || Object.prototype.hasOwnProperty.call(property, 'text'))
    }
  }
}
</script>

<style>

</style>
<style scoped>
  legend {
    float: none;
  }
  .cd-legend--text {
    background-color: darkgray;
  }
</style>
