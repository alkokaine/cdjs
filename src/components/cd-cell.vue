<template>
  <div class="cd-cell">
      <slot name="label"></slot>
      <template v-if="config.select">
        <cd-select :payload="config.select.payload()" :keyfield="config.select.valuekey" :labelkey="config.select.labelkey" :crud="config.select.crud" :resolvedata="config.select.resolveresult"></cd-select>
        <!-- <select class="form-select form-select-sm" :multiple="config.select.multiple" :name="config.datafield"
          :required="config.required">
          <option v-for="(option) in config.select.options()" :key="option[config.select.valuekey]"
            :disabled="config.select.isdisabled(option)" :label="option[config.select.labelkey]"
            :value="option[config.select.valuekey]"></option>
        </select>-->
      </template>
      <template v-else-if="config.textarea">
        <textarea :id="config.datafield"/>
      </template>
      <template v-else-if="config.input">
        <input :type="config.input.type" :name="config.datafield" :readonly="readonly"
          :value="value" :required="config.required" :pattern="config.input.pattern"
          :class="{'is-readonly': readonly}" :placeholder="config.input.placeholder"
          :min="config.input.min" :max="config.input.max" :minlength="config.input.minlength"
          :maxlength="config.input.maxlength"
          :checked="config.input.checked"/>
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
    config: { type: Object, required: true },
    showlabel: { type: Boolean, default: false },
    readonly: { type: Boolean, default: true }
  },
  data (cell) {
    return {
      value: cell.config.value()
    }
  }
}
</script>

<style>
  input.is-readonly {
    border-style: none;
    cursor: default;
    background-color: var(--bs-body-bg);
  }
  .form-control:focus{
    box-shadow: 0 0 0 0.05rem rgb(13 110 253 / 25%)!important;
  }
</style>
