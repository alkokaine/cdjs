<template>
  <div class="cd-cell">
    <slot name="label"></slot>
    <!-- <slot>
      <template v-if="config.select">
        <el-select v-model="value"
          :multiple="config.select.multiple"
          :value-key="config.select.valuekey"
          :clearable="config.select.clearable"
          :multiple-limit="config.select.limit"
          :disabled="readonly"
          :class="config.class"
          size="mini"
          :placeholder="config.placeholder"
          :filterable="config.select.filterable"
          :collapse-tags="config.select.collapsetags"
          :remote-method="config.select.remotemethod"
          v-on:change="config.select.change(values, $event)"
          v-on:blur="config.select.blur"
          v-on:clear="config.select.clear"
          v-on:focus="config.select.focus"
          v-on:remove-tag="config.select.removetag"
          v-on:visible-change="config.select.visiblechange">
          <cd-list class="cd-select--options" listclass="list-unstyled" rowclass="p-0 m-0 el-select-dropdown__item" :collection="values" :get="config.select" :resolveresult="resolveresult" :payload="config.select.payload" :keyfield="config.select.valuekey" :resolvepayload="config.select.resolvepayload" :onerror="onerror">
            <el-option slot="no-data" value="nodata" v-if="error">{{ error }}</el-option>
            <el-option slot-scope="option" :value="option.row[config.select.valuekey]" :label="option.row[config.select.labelkey]">
              <cd-props v-if="config.select.descriptor" :descriptor="config.select.descriptor" :payload="option.row"/>
              <span v-else>{{ option.row[config.select.labelkey] }}</span>
            </el-option>
          </cd-list>
        </el-select>
      </template>
      <template v-else-if="config.input">
        <el-date-picker v-if="config.input.type === 'date'" :class="config.class" v-model="value" :format="config.input.displayformat" :readonly="readonly" :editable="!readonly" value-format="timestamp"  size="mini" v-on:change="config.onchange" v-on:blur="config.onblur" v-on:focus="config.onfocus"></el-date-picker>
        <el-checkbox v-else-if="config.input.type === 'checkbox'" :class="config.class" v-model="value" size="mini"></el-checkbox>
        <code v-else-if="config.input.type === 'code'">
          {{ value }}
        </code>
        <template v-else>
          <el-input  v-debounce:0.3s="config.input.ondebounce" :type="config.input.type" :name="config.datafield" :readonly="readonly"
            v-model="value" :required="config.required" :pattern="config.input.pattern"
            :class="[{'is-readonly': readonly, 'form-check-input': config.input.type === 'checkbox' }, config.class]" :placeholder="config.input.placeholder"
            :min="config.input.min" :max="config.input.max" :minlength="config.input.minlength"
            :maxlength="config.input.maxlength"
            size="mini"
            :checked="config.input.checked" v-on:input="config.oninput" v-on:blur="config.onblur" v-on:change="config.onchange"/>
        </template>
      </template>
    </slot> -->
    <slot>
      <template v-if="editortype.isselect">
        <el-select v-model="cellvalue" :value-key="property.valuekey" :clearable="property.clearable" :placeholder="property.placeholder" :collapse-tags="property.collapsetags" :multiple="property.multiple" size="mini">
          <cd-list class="cd-select--options" listclass="list-unstyled" rowclass="p-0 m-0 el-select-dropdown__item" :collection="values" :keyfield="property.valuekey" :resolveresult="resolveresult" :get="property">
            <el-option slot-scope="option" :value="option.row[property.valuekey]" :label="option.row[property.labelkey]">
              <cd-props v-if="property.slotdescriptor" :payload="option.row" :descriptor="property.slotdescriptor"></cd-props>
              <span v-else>{{ option.row[property.labelkey] }}</span>
            </el-option>
          </cd-list>
        </el-select>
      </template>
      <template v-else-if="editortype.isautocomplete"></template>
      <template v-else-if="editortype.isdate"></template>
      <template v-else-if="editortype.isdaatetime"></template>
      <template v-else-if="editortype.isnumber"></template>
      <template v-else-if="editortype.ischeckbox"></template>
      <template v-else-if="editortype.isfile"></template>
      <template v-else-if="editortype.istextarea"></template>
      <template v-else-if="editortype.isslider"></template>
    </slot>
  </div>
</template>

<script>
import CDList from './cd-list.vue'
import CDProps from './cd-props.vue'
const { getDirective } = require('vue-debounce')
export default {
  name: 'cd-cell',
  directives: {
    debounce: getDirective()
  },
  components: {
    'cd-list': CDList,
    'cd-props': CDProps
  },
  props: {
    value: { type: [String, Number, Object, Array] },
    property: { type: Object, required: true },
    readonly: { type: Boolean, default: true }
  },
  data (cell) {
    return {
      cellvalue: cell.value,
      editortype: {
        isselect: cell.property.input === 'select',
        isautocomplete: cell.property.input === 'autocomplete',
        isdate: cell.property.input === 'date',
        isdatetime: cell.property.input === 'datetime',
        isnumber: cell.property.input === 'number',
        ischeckbox: cell.property.input === 'checkbox',
        isfile: cell.property.input === 'file',
        istextarea: cell.property.input === 'textarea'
      },
      values: [], // cell.config.select ? (cell.config.select.values || []) : [],
      error: Object,
      get: {}
    }
  },
  methods: {
    optionpropertyclass (...args) {
      // console.log(args)
      return 'option-property'
    },
    resolveresult (response) {
      this.values = this.config.select.resolveresult(response)
      this.error = Object
    },
    onreset () {
      this.config.reset()
    },
    onerror (reason) {
      this.error = reason
      this.values = []
      this.value = ''
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
