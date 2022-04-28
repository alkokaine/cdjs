<template>
  <fieldset class="cd-fieldset d-block w-auto" :class="[{ 'border border-1 mt-4' : haslegend(parent), 'inner': inner, 'px-2': !inner }]">
      <slot></slot>
      <cd-list class="cd-fieldset--props" :listclass="['list-unstyled cd-fieldset--inner', innerclass, { 'sm-container': !inner, 'mx-1': haslegend(parent) }]" keyfield="datafield" :rowclass="['cd-field--wrap', { 'inner': inner, 'px-2' : !inner }]" :isrowvisible="isvisible" :collection="descriptor">
        <div v-if="$slots.legend" class="position-relative pb-4" slot="header"><slot name="legend"></slot></div>
        <template slot-scope="{ row }">
          <template v-if="hasdescriptor(row)">
            <cd-fieldset :descriptor="row.descriptor" :isvisible="isvisible" :isdisabled="isdisabled" :parent="row" :resolvevalue="resolvevalue" :innerclass="row.class" :inner="true">
              <legend v-if="haslegend(row)" slot="legend" class="cd-legend position-absolute top-25 start-0 translate-middle-y ms-4">
                <span class="bg-secondary text-white px-3 py-1">{{ row.text }}</span>
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
      return (property) => (property !== undefined && Object.prototype.hasOwnProperty.call(property, 'text'))
    }
  }
}
</script>
