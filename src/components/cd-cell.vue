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
import CDSelect from './cd-select.vue'

export default {
  name: 'cd-cell',
  components: {
    'cd-select': CDSelect
  },
  props: {
    config: { type: Object, required: true },
    showlabel: { type: Boolean, default: false },
    readonly: { type: Boolean, default: true }
  },
  computed: {
    value () {
      return this.config.value()
    }
  },
  data (cell) {
    return {
      options: cell.config.options ? cell.config.options() : null
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
