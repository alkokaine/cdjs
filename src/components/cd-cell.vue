<template>
  <div class="cd-cell">
      <slot name="label"></slot>
      <template v-if="config.readonly">
        <span>{{ config.value }}</span>
      </template>
      <template v-else-if="config.select">
        <cd-select :payload="config.select.payload"
          :keyfield="config.select.valuekey"
          :labelkey="config.select.labelkey"
          :collection="config.select.values"
          :crud="config.select.crud"
          :value="value"
          :resolvedata="config.select.resolveresult"
          :isdisabled="config.select.isdisabled"
          :onselect="config.select.onselect">
        </cd-select>
      </template>
      <template v-else-if="config.textarea">
        <textarea :id="config.datafield"/>
      </template>
      <template v-else-if="config.input">
        <input v-model="value" v-debounce:1.5s.cancelonempty="config.input.ondebounce" :type="config.input.type" :name="config.datafield" :readonly="config.readonly"
          :required="config.required" :pattern="config.input.pattern" :disabled="config.readonly"
          :class="{'is-readonly': config.readonly, 'form-control form-control-sm': !config.readonly}" :placeholder="config.input.placeholder"
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
      value: ''
    }
  },
  watch: {
    'config.value': {
      handler (newvalue, oldvalue) {
        this.value = newvalue
      }
    }
  },
  methods: {
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
