<template>
  <div class="cd-cell">
    <slot name="label"></slot>
    <template v-if="readonly">
      <template v-if="config.route">
        <router-link :to="config.route">{{ config.value }}</router-link>
      </template>
      <template v-else>
        <span>{{ config.value }}</span>
      </template>
    </template>
    <template v-else>
    <template v-if="config.select">
      <cd-select :payload="config.select.payload"
        :keyfield="config.select.valuekey"
        :labelkey="config.select.labelkey"
        :config="config.select.config"
        :value="config.value"
        :get="config.select.get"
        :collection="values"
        :isdisabled="config.select.isdisabled"
        :clearable="config.select.clearable"
        :resolveresult="resolveresult"
        :onselect="config.select.onselect"></cd-select>
      </template>
      <template v-else-if="config.textarea">
        <textarea class="form-control form-control-sm" :id="config.datafield"/>
      </template>
      <template v-else-if="config.input">
        <code v-if="config.input.type === 'code'" class="form-control form-control-sm">
          {{ config.value }}
        </code>
        <template v-else>
          <input class="form-control form-control-sm" v-debounce:0.3s="config.input.ondebounce" :type="config.input.type" :name="config.datafield" :readonly="readonly"
            :value="config.value" :required="config.required" :pattern="config.input.pattern"
            :class="{'is-readonly': readonly, 'form-check-input': config.input.type === 'checkbox' }" :placeholder="config.input.placeholder"
            :min="config.input.min" :max="config.input.max" :minlength="config.input.minlength"
            :maxlength="config.input.maxlength"
            :checked="config.input.checked" v-on:input="config.oninput" v-on:blur="config.onblur" v-on:change="config.onchange"/>
        </template>
      </template>
    </template>
    <button v-if="config.clearable" class="btn bg-transparent cd-clear--button btn-sm" v-on:click.stop="config.reset"><i class="bi bi-x-circle" ></i></button>
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
      values: cell.config.select ? (cell.config.select.values || []) : []
    }
  },
  methods: {
    resolveresult (response) {
      this.values = this.config.select.resolveresult(response)
    }
  }
}
</script>

<style>
  .cd-cell {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  .cd-clear--button {
    margin-left: -40px;
  }
  input.is-readonly {
    border-style: none;
    cursor: default;
    background-color: var(--bs-body-bg);
  }
  .form-control:focus{
    box-shadow: 0 0 0 0.05rem rgb(13 110 253 / 25%)!important;
  }
</style>
