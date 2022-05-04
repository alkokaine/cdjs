<template>
  <div class="cd-cell" :class="{ 'd-block': editortype.istextarea, 'is-readonly': readonly }">
    <slot name="label"></slot>
    <slot>
      <template v-if="editortype.isselect">
        <el-select class="w-100" :disabled="disabled" v-model="cellvalue" :value-key="property.valuekey" :clearable="property.clearable" :placeholder="property.placeholder"
          :collapse-tags="property.collapsetags" :multiple="property.multiple" size="mini" :remote="true" :remote-method="retrieveoptions"
          v-on:change="onchange({ $event: option($event), property }, ($event === '' ? property.reset : property.onselect))" v-on:visible-change="onvisiblechange({ $event, property }, property.onvisiblechange)"
          v-on:remove-tag="onremovetag({ $event, property }, property.onremovetag)" v-on:clear="onclear({ $event, property }, property.onclear)"
          v-on:blur="onblur({ $event, property }, property.onblur)" v-on:focus="onfocus({ $event, property }, property.onfocus)">
          <cd-list class="cd-select--options" listclass="list-unstyled" rowclass="el-select-dropdown__item pt-1 pb-1" :onerror="onerror"
            :collection="values" :keyfield="property.valuekey" :resolveresult="resolveresult" :payload="property.payload" :get="get" :resolvepayload="property.resolvepayload">
            <el-option slot-scope="option" :value="option.row[property.valuekey]" :label="option.row[property.labelkey]">
              <cd-props v-if="property.slotdescriptor" :payload="option.row" :descriptor="property.slotdescriptor"></cd-props>
              <span v-else>{{ option.row[property.labelkey] }}</span>
            </el-option>
            <el-option slot="no-data" :value="(error ? error : nullvalue)">
              <el-empty>
                <cd-props class="error-info" v-if="error" :payload="error" :descriptor="errordescriptor"></cd-props>
              </el-empty>
            </el-option>
          </cd-list>
        </el-select>
      </template>
      <template v-else-if="editortype.isautocomplete">
        <el-autocomplete class="w-100" :disabled="disabled" :placeholder="property.placeholder" :clearable="property.clearable" v-model="cellvalue" :debounce="500"
          :value-key="property.valuekey" :placement="property.placement" :fetch-suggestions="fetchsuggestions" size="mini"
          :trigger-on-focus="property.focustrigger" :name="property.datafield" v-on:select="onselect({ $event, property }, property.onselect)"
          v-on:change="onchange({ $event, property }, property.onchange)" v-on:focus="onfocus({ $event, property }, property.onfocus)" v-on:blur="onblur({ $event, property }, property.onblur)"
          v-on:input="oninput({ $event, property }, property.oninput)" v-on:clear="onclear({ $event, property }, property.onclear)">
          <div slot-scope="option">
              <cd-props v-if="property.slotdescriptor" :payload="option.item" :descriptor="property.slotdescriptor"></cd-props>
              <span v-else>{{ option.item[property.labelkey] }}</span>
          </div>
        </el-autocomplete>
      </template>
      <template v-else-if="editortype.isdate">
        <el-date-picker class="w-100" :disabled="disabled" size="mini" v-model="cellvalue" :placeholder="property.placeholder" :clearable="property.clearable"
          :format="property.displayformat" value-format="timestamp"
          :editable="property.editable" :align="property.align" :name="property.datafield" :picker-options="pickeroptions"
          v-on:change="onchange({ $event, property },  property.onchange)"
          v-on:blur="onblur({ $event, property }, property.onblur)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:clear="onclear({ $event, property }, property.onclear)">
        </el-date-picker>
      </template>
      <template v-else-if="editortype.isdatetime"></template>
      <div v-else-if="editortype.isnumber" class="el-input el-input--mini w-100" :class="[{ 'is-disabled': disabled }]">
        <input :disabled="disabled" class="el-input el-input__inner" :class="[{ 'is-disabled': disabled }]" type="number" v-model="cellvalue"
          :clearable="property.clearable"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:change="onchange({ $event, property }, property.onchange)"
          v-on:blur="onblur({ $event, property }, property.onblur)"/>
      </div>
      <template v-else-if="editortype.ischeckbox">
        <el-checkbox class="cd-checkbox" size="mini" v-model="cellvalue" :disabled="disabled" v-on:change="onchange({ $event, property }, property.onchange)" :checked="ischecked"></el-checkbox>
      </template>
      <template v-else-if="editortype.isfile">
        <el-upload class="cd-upload" :action="property.url" :headers="property.headers" :multiple="property.multiple"></el-upload>
      </template>
      <template v-else-if="editortype.istextarea">
        <el-input type="textarea" v-model="cellvalue" :disabled="disabled"
          v-on:blur="onblur({ $event, property}, property.onblur)"
          v-on:change="onchange({ $event, property}, property.onchange)"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:clear="onclear({ $event, property }, property.onclear)"></el-input>
      </template>
      <template v-else-if="editortype.isslider">
        <input type="range" class="form-range" :min="property.min" :max="property.max" :step="property.step" v-model="cellvalue" :disabled="disabled"
          v-on:change="onchange({ $event, property }, property.onchange)"
          v-on:input="oninput({ $event, property }, property.oninput)"/>
      </template>
      <template v-else-if="editortype.isswitch">
        <el-switch v-model="cellvalue" v-on:change="onchange({ $event, property }, property.onchange)" :disabled="disabled"></el-switch>
      </template>
      <template v-else-if="!isarray">
        <el-input v-model="cellvalue" size="mini" :disabled="disabled" :placeholder="property.placeholder" :clearable="property.clearable"
          v-on:change="onchange({ $event, property }, property.onchange)"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:blur="onblur({ $event, property }, property.onblur)"></el-input>
      </template>
    </slot>
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
    revert: { type: Boolean },
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
    }
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
        isnumber: property.input === 'number',
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
    revert: {
      handler (newvalue) {
        const cell = this
        if (newvalue === true) {
          Vue.set(cell, 'cellvalue', (cell.resolvevalue(cell.property, cell.value)))
        }
      }
    }
  },
  methods: {
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
      // console.log(args)
      return 'option-property'
    },
    resolveresult (response) {
      this.values = this.property.resolveresult(response)
      this.cellvalue = null
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
        cell.property.data(query),
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
    get () {
      return this.property
    }
  }
}
</script>

<style>
  .el-select-dropdown__item {
    height: unset!important;
    line-height: unset!important;
  }
  .cd-cell {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  .cd-no-data--option {
    width: 300px;
    height: 75px;
  }
  .cd-field {
    margin-bottom: 0.5em;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: var(--bs-body-bg)!important;
    color: var(--bs-body-color)!important;
    cursor: default!important;;
  }
  .error-info {
    white-space: pre-line;
    width: 250px;
  }
  .el-popper {
    min-width: unset!important;
  }
  .error-message {
    font-size: 0.7em;
  }
  .error-details {
  }
  .tumbleweed {
    width: inherit;
  }
  /*
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
  .option-descriptor {
    display: contents;
  }
  .cd-select--options {
    display: contents;
  }
  .cd-slider {
    width: 100%;
  } */
  .el-empty__image {
    width: 250px;
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
