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
      <el-select v-model="value"
        :multiple="config.select.multiple"
        :value-key="config.select.valuekey"
        :clearable="config.select.clearable"
        :multiple-limit="config.select.limit"
        :placeholder="config.placeholder"
        :filterable="config.select.filterable"
        :collapse-tags="config.select.collapsetags"
        :remote-method="config.select.remotemethod"
        v-on:change="config.select.change(values, $event)"
        v-on:blur="config.select.blur"
        v-on:focus="config.select.focus"
        v-on:remove-tag="config.select.removetag"
        v-on:visible-change="config.select.visiblechange">
        <cd-list class="cd-select--options" listclass="list-unstyled" rowclass="p-0 m-0" :collection="values" :get="config.select.get" :resolveresult="resolveresult" :keyfield="config.select.valuekey" :resolvepayload="config.select.resolvepayload" :onerror="onerror">
          <el-option slot="no-data" value="nodata" v-if="error">{{ error }}</el-option>
          <el-option slot-scope="option" :value="option.row[config.select.valuekey]" :label="option.row[config.select.labelkey]">
            <cd-list class="option-descriptor" v-if="config.select.descriptor" :collection="config.select.descriptor" :readonly="true" keyfield="datafield" listclass="list-unstyled">
              <span slot-scope="prop">{{ option.row[prop.row.datafield] }}</span>
            </cd-list>
          </el-option>
        </cd-list>
      </el-select>
      </template>
      <template v-else-if="config.textarea">
        <textarea class="form-control form-control-sm" :id="config.datafield"/>
      </template>
      <template v-else-if="config.input">
        <el-date-picker v-if="config.input.type === 'date'" :value="value"></el-date-picker>
        <el-checkbox v-else-if="config.input.type === 'checkbox'" v-model="value"></el-checkbox>
        <code v-else-if="config.input.type === 'code'">
          {{ value }}
        </code>
        <template v-else>
          <el-input v-debounce:0.3s="config.input.ondebounce" :type="config.input.type" :name="config.datafield" :readonly="readonly"
            :value="value" :required="config.required" :pattern="config.input.pattern"
            :class="{'is-readonly': readonly, 'form-check-input': config.input.type === 'checkbox' }" :placeholder="config.input.placeholder"
            :min="config.input.min" :max="config.input.max" :minlength="config.input.minlength"
            :maxlength="config.input.maxlength"
            :checked="config.input.checked" v-on:input="config.oninput" v-on:blur="config.onblur" v-on:change="config.onchange"/>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { getDirective } from 'vue-debounce'
import { DatePicker, Select, Input } from 'element-ui'
import CDList from './cd-list.vue'

export default {
  name: 'cd-cell',
  directives: {
    debounce: getDirective()
  },
  components: {
    'el-select': Select,
    'el-date-picker': DatePicker,
    'el-input': Input,
    'cd-list': CDList
  },
  props: {
    config: { type: Object, required: true },
    showlabel: { type: Boolean, default: false },
    readonly: { type: Boolean, default: true }
  },
  data (cell) {
    return {
      value: cell.config.value,
      values: cell.config.select ? (cell.config.select.values || []) : [],
      error: Object
    }
  },
  methods: {
    optionpropertyclass (...args) {
      console.log(args)
      return 'option-property'
    },
    resolveresult (response) {
      this.values = this.config.select.resolveresult(response)
    },
    onreset () {
      this.value = ''
      this.config.reset()
    },
    onerror (reason) {
      this.error = reason
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
  .el-select-dropdown__item {
    height: unset!important;
    line-height: unset!important;
  }
  .option-descriptor {
    display: contents;
  }
  .cd-select--options {
    display: contents;
  }
</style>
<style scoped>

</style>
