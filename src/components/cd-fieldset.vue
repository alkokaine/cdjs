<template>
  <fieldset class="cd-fieldset" :class="{ 'inline': inline }">
    <slot></slot>
    <div class="cd-field" :class="[{ 'inner' : inner}, property.class]" v-for="(property,index) in visibleproperties" :key="propertykey(property,index)">
      <template v-if="hasdescriptor(property)">
        <cd-fieldset class="inner"
            :class="property.class"
            :isvisible="isvisible"
            :propertyconfig="propertyconfig"
            :descriptor="property.descriptor"
            :readonly="readonly"
            :resolvefieldclass="resolvefieldclass"
            :inner="true"
            :inline="inline">
            <legend v-if="haslegend(property)" class="cd-legend w-auto form-label">{{ property.text }}</legend>
        </cd-fieldset>
      </template>
      <template v-else>
        <cd-cell :class="[resolvefieldclass(property), { 'inner': inner }]" :config="propertyconfig(property)" :readonly="readonly(property)">
          <label class="cd-label form-label" :for="property.datafield" slot="label">{{ property.text }}</label>
        </cd-cell>
      </template>
    </div>
  </fieldset>
</template>

<script>
import props from '../common/property-decorator'
import cell from './cd-cell.vue'

export default {
  name: 'cd-fieldset',
  mixins: [props],
  props: {
    propertyconfig: { type: Function },
    resolvefieldclass: { type: Function },
    readonly: { type: Function },
    inline: { type: Boolean, default: false },
    inner: { type: Boolean, default: false }
  },
  components: {
    'cd-cell': cell
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
    font-size: inherit;
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
