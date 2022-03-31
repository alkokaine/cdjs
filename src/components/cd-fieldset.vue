<template>
  <fieldset class="cd-fieldset">
    <slot></slot>
    <!-- <div class="cd-field" :class="[{ 'inner' : inner}, property.class]" v-for="(property,index) in visibleproperties" :key="propertykey(property,index)">
      <template v-if="hasdescriptor(property)">
        <cd-fieldset class="inner"
            :editmode="editmode"
            :class="property.class"
            :isvisible="isvisible"
            :propertyconfig="propertyconfig"
            :descriptor="property.descriptor"
            :readonly="readonly"
            :resolvefieldclass="resolvefieldclass"
            :inner="true"
            :inline="inline">
            <legend class="cd-legend w-auto form-label">{{ property.text }}</legend>
        </cd-fieldset>
      </template>
      <template v-else>
        <cd-cell :class="[resolvefieldclass(property), { 'inner': inner }]" :config="propertyconfig(property)" :readonly="!editmode || readonly(property)">
          <label class="cd-label form-label mb-0" :for="property.datafield" slot="label">{{ property.text }}</label>
        </cd-cell>
      </template>
    </div> -->
    <cd-list listclass="list-unstyled cd-field" keyfield="datafield" :rowclass="['cd-field', { 'inner': inner }]" :isrowvisible="isvisible" :collection="descriptor">
      <div class="cd-fieldset--header" slot="header"><slot name="legend"></slot></div>
      <template slot-scope="property">
        <cd-fieldset v-if="property.descriptor" :descriptor="property.descriptor" :isvisible="isvisible" :resolvevalue="resolvevalue">
          <legend v-if="haslegend(property.row)" slot="legend">{{ property.row.text }}</legend>
        </cd-fieldset>
        <slot v-else>
          <cd-cell :value="resolvevalue(property.row)" :property="property.row">
            <label slot="label" class="cd-label form-label mb-0" :for="property.row.datafield">{{ property.row.text }}</label>
          </cd-cell>
        </slot>
      </template>
    </cd-list>
  </fieldset>
</template>

<script>
import props from '../common/property-decorator'
import cell from './cd-cell.vue'
import list from './cd-list.vue'
export default {
  name: 'cd-fieldset',
  mixins: [props],
  props: {
    propertyconfig: { type: Function },
    resolvefieldclass: { type: Function },
    editmode: { type: Boolean, default: true },
    readonly: { type: Function },
    inner: { type: Boolean, default: false },
    resolvevalue: { type: Function, required: true }
  },
  components: {
    'cd-cell': cell,
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
</style>
