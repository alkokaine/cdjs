<template>
  <div class="cd-field">
    <template v-if="editortype.isselect">
      <el-select class="w-100" :disabled="disabled" v-model="cellvalue" :value-key="property.valuekey" :clearable="property.clearable" :placeholder="property.placeholder"
        :filterable="property.filterable"
        :collapse-tags="property.collapsetags" :multiple="property.multiple" size="mini" :remote="true" :remote-method="retrieveoptions"
        v-on:change="onchange({ $event: option($event), property }, ($event === '' ? property.reset : property.onselect))"
        v-on:visible-change="onvisiblechange({ $event, property }, property.onvisiblechange)"
        v-on:remove-tag="onremovetag({ $event, property }, property.onremovetag)"
        v-on:clear="onclear({ $event, property }, property.onclear)"
        v-on:blur="onblur({ $event, property }, property.onblur)"
        @input="dispatch"
        v-on:focus="onfocus({ $event, property }, property.onfocus)" >
        <cd-list class="cd-select--options" listclass="list-unstyled" :errorRequest="onerror" :beforeRequest="onbefore"
          :collection="values" :keyfield="property.valuekey" :resolveresult="resolveresult" :payload="property.payload" :get="property" :headers="property.headers" :resolvepayload="resolvepayload">
          <el-option slot-scope="{ row }" :value="row[property.valuekey]" :label="row[property.labelkey]" :disabled="isoptiondisabled(row)">
            <cd-props v-if="property.slotdescriptor" :payload="row" :descriptor="property.slotdescriptor"></cd-props>
            <span v-else>{{ row[property.labelkey] }}</span>
          </el-option>
          <div class="select-no-data" slot="no-data">
            <template v-if="error">
              <el-option class="error-info" v-if="error" :value="error">
                <cd-props class="error-info" :payload="error" :descriptor="errordescriptor"></cd-props>
              </el-option>
            </template>
            <el-option v-if="isempty" :value="nullvalue">
              <div class="mx-auto"><div class="py-2 px-1">Нет данных</div></div>
            </el-option>
          </div>
        </cd-list>
      </el-select>
    </template>
    <template v-else-if="editortype.isautocomplete">
      <el-autocomplete class="w-100" :disabled="disabled" :placeholder="property.placeholder" :clearable="property.clearable" v-model="cellvalue" :debounce="300"
        :value-key="property.valuekey" :placement="property.placement" :fetch-suggestions="fetchsuggestions" size="mini"
        :trigger-on-focus="property.focustrigger" :name="property.datafield" v-on:select="onselect({ $event, property }, property.onselect)"
        v-on:change="onchange({ $event, property }, property.onchange)" v-on:focus="onfocus({ $event, property }, property.onfocus)" v-on:blur="onblur({ $event, property }, property.onblur)"
        v-on:input="oninput({ $event, property }, property.oninput)" v-on:clear="onclear({ $event, property }, property.onclear)"
        @input="dispatch">
        <div slot-scope="{ item }" :class="['cd-autocomplete--option my-1', {'pe-none': isoptiondisabled(item) }]">
            <cd-props v-if="property.slotdescriptor" :payload="item" :descriptor="property.slotdescriptor"></cd-props>
            <span v-else>{{ item[property.labelkey] }}</span>
        </div>
      </el-autocomplete>
    </template>
    <template v-else-if="editortype.isdate">
      <el-date-picker class="w-100" :disabled="disabled" size="mini" v-model="cellvalue" :placeholder="property.placeholder" :clearable="property.clearable"
        :format="property.displayformat" :value-format="property.valueformat"
        :editable="property.editable" :name="property.datafield" :picker-options="pickeroptions"
        v-on:change="onchange({ $event, property },  property.onchange)"
        v-on:blur="onblur({ $event, property }, property.onblur)"
        v-on:focus="onfocus({ $event, property }, property.onfocus)"
        v-on:input="oninput({ $event, property }, property.oninput)"
        v-on:clear="onclear({ $event, property }, property.onclear)"  @input="dispatch">
      </el-date-picker>
    </template>
    <template v-else-if="editortype.isdatetime"></template>
    <div v-else-if="editortype.isnumber" class="el-input el-input--mini w-100" :class="[{ 'is-disabled': disabled }]">
      <input :disabled="disabled" class="el-input el-input__inner" :class="[{ 'is-disabled': disabled }]" type="number" v-model="cellvalue"
        :clearable="property.clearable"
        v-on:input="oninput({ $event, property }, property.oninput)"
        v-on:focus="onfocus({ $event, property }, property.onfocus)"
        v-on:change="onchange({ $event, property }, property.onchange)"
        v-on:blur="onblur({ $event, property }, property.onblur)"  @input="dispatch"/>
    </div>
    <template v-else-if="editortype.ischeckbox">
      <el-checkbox class="cd-checkbox" size="mini" v-model="cellvalue" :disabled="disabled" v-on:change="onchange({ $event, property }, property.onchange)" :checked="ischecked" @input="dispatch"></el-checkbox>
    </template>
    <template v-else-if="editortype.isfile">
      <el-upload class="cd-upload" :action="property.url" :headers="property.headers" :multiple="property.multiple" ></el-upload>
    </template>
    <template v-else-if="editortype.istextarea">
      <el-input type="textarea" v-model="cellvalue" :disabled="disabled"
        v-on:blur="onblur({ $event, property}, property.onblur)"
        v-on:change="onchange({ $event, property}, property.onchange)"
        v-on:input="oninput({ $event, property }, property.oninput)"
        v-on:focus="onfocus({ $event, property }, property.onfocus)"
        v-on:clear="onclear({ $event, property }, property.onclear)"  @input="dispatch"></el-input>
    </template>
    <template v-else-if="editortype.isslider">
      <input type="range" class="form-range" :min="property.min" :max="property.max" :step="property.step" v-model="cellvalue" :disabled="disabled"
        v-on:change="onchange({ $event, property }, property.onchange)"
        v-on:input="oninput({ $event, property }, property.oninput)" @input="dispatch"/>
    </template>
    <template v-else-if="editortype.isswitch">
      <el-switch v-model="cellvalue" v-on:change="onchange({ $event, property }, property.onchange)" :disabled="disabled" @input="dispatch"></el-switch>
    </template>
    <template v-else-if="!isarray">
      <el-input v-model="cellvalue" size="mini" :disabled="disabled" :placeholder="property.placeholder" :clearable="property.clearable"
        v-on:change="onchange({ $event, property }, property.onchange)"
        v-on:input="oninput({ $event, property }, property.oninput)"
        v-on:focus="onfocus({ $event, property }, property.onfocus)"
        v-on:blur="onblur({ $event, property }, property.onblur)" @input="dispatch"></el-input>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
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
    disabled: { type: Boolean, default: false },
    property: { type: Object, required: true },
    readonly: { type: Boolean, default: true },
    value: { type: [String, Number, Object, Array, Date, Boolean] },
    onchange: { type: Function },
    oninput: { type: Function },
    onblur: { type: Function },
    onfocus: { type: Function },
    onclear: { type: Function },
    onselect: { type: Function },
    isoptiondisabled: { type: [Boolean, Function] },
    errordescriptor: {
      type: Array,
      default: function () {
        return [
          {
            descriptor: [
              {
                descriptor: [
                  {
                    datafield: 'status',
                    class: 'error-status w-25'
                  },
                  {
                    datafield: 'status_text',
                    class: 'error-status-text w-75'
                  }
                ],
                class: 'response-status d-inline'
              },
              {
                datafield: 'response',
                class: 'error-message'
              },
              {
                datafield: 'message',
                class: 'error-details'
              }
            ],
            class: 'error-info'
          }
        ]
      }
    },
    parent: { type: Object },
    resolvepayload: { type: Function }
  },
  data (cell) {
    const property = cell.property
    return {
      isarray: Array.isArray(cell.value),
      cellvalue: cell.resolvevalue(property, cell.value),
      nullvalue: null,
      editortype: {
        isselect: property.input === 'select',
        isautocomplete: property.input === 'autocomplete',
        isdate: property.input === 'date',
        isdatetime: property.input === 'datetime',
        isnumber: ['number', 'money'].includes(property.input),
        ischeckbox: property.input === 'checkbox',
        isfile: property.input === 'file',
        istextarea: property.input === 'textarea',
        isslider: property.input === 'slider',
        isswitch: property.input === 'switch'
      },
      pickeroptions: property.options,
      values: (property.values || []),
      error: false
    }
  },
  watch: {
    'property.url': {
      handler (newvalue) {
        this.values = []
      }
    }
  },
  methods: {
    dispatch (e) {
      const isevent = isNaN(+e) && e.target !== undefined
      if (!isevent) this.$emit('input', e)
      else this.$emit('input', e.target.value)
    },
    reload () {
      const cell = this
      const url = cell.property.url
      const timeout = (cell.property.timeout || 50)
      setTimeout(() => { Vue.set(cell.property, 'url', '') }, timeout)
      setTimeout(() => { Vue.set(cell.property, 'url', url) }, timeout)
    },
    retrieveoptions () {
      const cell = this
      return () => {
        Vue.set(cell, 'values', cell.property.values)
      }
    },
    resolvevalue (property, value) {
      if (property.input === 'slider') {
        return (value || 0)
      } else {
        return (value || null)
      }
    },
    option (event) {
      const cell = this
      if (event === null || event === undefined) return null
      if (event === cell.error) return event
      if (Array.isArray(event)) {
        return event
      }
      return this.values.find(o => o[cell.property.valuekey] === event)
    },
    optionpropertyclass (...args) {
      return 'option-property'
    },
    resolveresult (response) {
      this.values = this.property.resolveresult(response)
      this.cellvalue = this.value
      this.error = false
    },
    onerror ({ message, request, response }) {
      this.error = {
        type: 'error',
        status: (response || {}).status,
        status_text: (response || {}).statusText,
        response: (request || {}).response,
        message: message
      }
      this.values = []
      this.cellvalue = ''
      if (this.property.onerror && typeof this.property.onerror === 'function') this.property.onerror(this.error)
    },
    onbefore (config) {
      if (this.property.onbefore && typeof this.property.onbefore) return this.property.onbefore(config)
      return config
    },
    onvisiblechange (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    onremovetag (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    fetchsuggestions (query, callback) {
      const cell = this
      cell.$http[cell.property.method](cell.property.url,
        cell.resolvepayload(query),
        {
          headers: cell.property.headers
        }
      ).then((response) => {
        callback(cell.property.resolveresult(response))
      }).catch((reason) => {
        cell.onerror(reason)
      })
    }
  },
  computed: {
    ischecked () {
      return this.value === true
    },
    isempty () {
      return this.values.length === 0
    }
  }
}
</script>

<style>
  .el-select-dropdown__item {
    height: unset!important;
    line-height: unset!important;
  }
  .cd-autocomplete--option {
    white-space: normal;
    line-height: 1rem;
  }
</style>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  .cd-slider {
    width: 100%;
  }
</style>
