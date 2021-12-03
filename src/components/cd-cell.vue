<template>
  <div class="cd-cell">
      <slot name="label"></slot>
      <template v-if="config.select">
        <cd-select :payload="config.select.payload()"
          :keyfield="config.select.valuekey"
          :labelkey="config.select.labelkey"
          :crud="config.select.crud"
          :value="value"
          :resolvedata="config.select.resolveresult"
          :isdisabled="config.select.isdisabled">
        </cd-select>
      </template>
      <template v-else-if="config.textarea">
        <textarea :id="config.datafield"/>
      </template>
      <template v-else-if="config.input">
        <input v-model="value" v-debounce:1.5s.cancelonempty="config.input.ondebounce" :type="config.input.type" :name="config.datafield" :readonly="config.readonly"
          :value="value" :required="config.required" :pattern="config.input.pattern"
          :class="{'is-readonly': config.readonly}" :placeholder="config.input.placeholder"
          :min="config.input.min" :max="config.input.max" :minlength="config.input.minlength"
          :maxlength="config.input.maxlength"
          :checked="config.input.checked"
          v-on:input="config.oninput"/>
      </template>
  </div>
</template>

<script>
import { getDirective } from 'vue-debounce'
import CDSelect from './cd-select.vue'

export default {
  name: 'cd-cell',
  directives: {
    debounce: getDirective()
  },
  components: {
    'cd-select': CDSelect
  },
  props: {
    config: { type: Object, required: true }
  },
  data (cell) {
    return {
      value: cell.config.value
    }
  },
  watch: {
    value: {
      handler (nvalue, ovalue) {
        this.config.propertychange({ newvalue: nvalue, oldvalue: ovalue })
      }
    }
  }
}
</script>

<style>
  input.is-readonly {
    border-style: none;
    cursor: default;
  }
  .cd-cell>input {
    vertical-align: middle;
  }
</style>
