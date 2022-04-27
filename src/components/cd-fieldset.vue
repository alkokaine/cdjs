<template>
  <fieldset class="cd-fieldset d-block">
    <slot></slot>
    <cd-list listclass="list-unstyled cd-fieldset--inner" keyfield="datafield" :rowclass="['cd-field', { 'inner': inner }]" :isrowvisible="isvisible" :collection="descriptor">
      <div class="d-block cd-fieldset--header w-auto" slot="header"><slot name="legend"></slot></div>
      <template slot-scope="{ row }">
        <template v-if="row.descriptor">
          <cd-fieldset :descriptor="row.descriptor" :isvisible="isvisible" :isdisabled="isdisabled" :parent="row" :resolvevalue="resolvevalue">
            <legend v-if="haslegend(row)" slot="legend">{{ row.text }}</legend>
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
    isvalid: { type: Function, default: (property) => (false) }
  },
  components: {
    'cd-list': list
  },
  computed: {
    hasdescriptor () {
      return (property) => Object.prototype.hasOwnProperty.call(property, 'descriptor') && Array.isArray(property.descriptor) && property.descriptor.length
    },
    haslegend () {
      return (property) => Object.prototype.hasOwnProperty.call(property, 'text')
    }
  }
}
</script>

<style>
  .cd-legend {
    background-color: lightgray;
    display: block;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 10px;
    float: none;
  }
  .cd-label {
    font-weight: bold;
    margin-bottom: unset;
  }
  .cd-label::after {
    content: ":";
    margin-right: 5px;
  }
  .cd-fieldset.inline {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
  }
  .cd-field {
    margin-bottom: 0.5em;
  }
  .form-label {
    margin-bottom: unset;
    white-space: nowrap;
  }
  .cd-fieldset--inner {
    padding-inline-start: 0;
    margin-inline-start: 0;
  }
</style>
<style scoped>
  .cd-fieldset.row> *:first-child {
    padding-left: unset;
  }
  .cd-fieldset.row> *:last-child {
    padding-right: unset;
  }
  .cd-field.row {
    margin-right: unset;
    margin-left: unset;
  }
  .cd-field.row > * {
    flex-shrink: 0;
    width: 100%;
    max-width: 100%;
    padding-right: unset;
    padding-left: unset;
    margin-left: unset;
    margin-right: unset;
}
  legend {
    float: none;
  }
</style>
