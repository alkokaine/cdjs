<template>
  <fieldset class="cd-fieldset border p-2">
        <slot></slot>
        <div class="cd-field" v-for="(property,index) in visibleproperties" :key="propertykey(property,index)">
            <cd-fieldset v-if="hasdescriptor(property)"
                :class="property.class"
                :isvisible="isvisible"
                :iseditable="iseditable"
                :propertyconfig="propertyconfig"
                :descriptor="property.descriptor">
                <legend v-if="haslegend(property)" class="cd-legend w-auto">{{ property.text }}</legend>
            </cd-fieldset>
            <cd-cell v-else :config="propertyconfig(property)">
              <label class="cd-label" :for="property.datafield" slot="label">{{ property.text }}</label>
            </cd-cell>
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
    propertyconfig: { type: Function }
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
  .cd-field>fieldset.cd-fieldset {
    margin-top: 10px;
  }
  .cd-label {
    font-weight: bold;
  }
  .cd-label::after {
    content: ":";
    margin-right: 5px;
  }
</style>
