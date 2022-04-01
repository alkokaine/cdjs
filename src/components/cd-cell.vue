<template>
  <div class="cd-cell ms-2 me-2" :class="{ 'd-block': editortype.istextarea, 'is-readonly': readonly }">
    <slot name="label"></slot>
    <slot>
      <template v-if="editortype.isselect">
        <el-select class="w-100" :disabled="disabled" v-model="cellvalue" :value-key="property.valuekey" :clearable="property.clearable" :placeholder="property.placeholder"
          :collapse-tags="property.collapsetags" :multiple="property.multiple" size="mini"
          v-on:change="onchange({ $event, property }, property.onchange)" v-on:visible-change="onvisiblechange({ $event, property }, property.onvisiblechange)"
          v-on:remove-tag="onremovetag({ $event, property }, property.onremovetag)" v-on:clear="onclear({ $event, property }, property.onclear)"
          v-on:blur="onblur({ $event, property }, property.onblur)" v-on:focus="onfocus({ $event, property }, property.onfocus)">
          <cd-list class="cd-select--options" listclass="list-unstyled" rowclass="p-0 m-0 el-select-dropdown__item"
            :collection="values" :keyfield="property.valuekey" :resolveresult="resolveresult" :get="property">
            <el-option slot-scope="option" :value="option.row[property.valuekey]" :label="option.row[property.labelkey]">
              <cd-props v-if="property.slotdescriptor" :payload="option.row" :descriptor="property.slotdescriptor"></cd-props>
              <span v-else>{{ option.row[property.labelkey] }}</span>
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
      <div v-else-if="editortype.isnumber" class="el-input--mini w-100">
        <input :disabled="disabled" class="el-input__inner" type="number" v-model="cellvalue"
          :clearable="property.clearable"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:change="onchange({ $event, property }, property.onchange)"
          v-on:blur="onblur({ $event, property }, property.onblur)"/>
      </div>
      <template v-else-if="editortype.ischeckbox">
        <el-checkbox class="cd-checkbox" size="mini" v-model="cellvalue" :disabled="disabled" v-on:change="onchange({ $event, property}, property.onchange)"></el-checkbox>
      </template>
      <template v-else-if="editortype.isfile">
        <el-upload class="cd-upload" :action="property.url" :headers="property.headers" :multiple="property.multiple"></el-upload>
      </template>
      <template v-else-if="editortype.istextarea">
        <el-input type="textarea" v-model="cellvalue"
          v-on:blur="onblur({ $event, property}, property.onblur)"
          v-on:change="onchange({ $event, property}, property.onchange)"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:clear="onclear({ $event, property }, property.onclear)"></el-input>
      </template>
      <template v-else-if="editortype.isslider">
        <el-slider class="cd-slider ms-2" v-model="cellvalue" :show-stops="property.showstops" :step="property.step"
          :show-input="property.showinput" :range="property.range" :min="property.min"
          :max="property.max" :vertical="property.vertical" :marks="property.marks"
          :show-input-controls="property.showcontrols" input-size="mini" :show-tooltip="property.showtooltip"
          :format-tooltip="property.ftooltip" :height="property.height" :debounce="property.debounce"
          v-on:change="onchange({ $event, property }, property.onchange)"
          v-on:input="oninput({ $event, property }, property.oninput)"></el-slider>
      </template>
      <template v-else-if="editortype.isswitch">
        <el-switch v-model="cellvalue" v-on:change="onchange({ $event, property }, property.onchange)"></el-switch>
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
    value: { type: [String, Number, Object, Array, Date, Boolean] },
    property: { type: Object, required: true },
    readonly: { type: Boolean, default: true },
    onchange: { type: Function },
    oninput: { type: Function },
    onblur: { type: Function },
    onfocus: { type: Function },
    onclear: { type: Function },
    onselect: { type: Function }
  },
  data (cell) {
    const property = cell.property.row
    return {
      isarray: Array.isArray(cell.value),
      cellvalue: cell.value,
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
      error: Object
    }
  },
  methods: {
    optionpropertyclass (...args) {
      // console.log(args)
      return 'option-property'
    },
    resolveresult (response) {
      this.values = this.property.resolveresult(response)
      this.error = Object
    },
    onreset () {
      this.config.reset()
    },
    onerror (reason) {
      this.error = reason
      this.values = []
      this.value = ''
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
        console.log(reason)
      })
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
  .cd-slider {
    width: 100%;
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
</style>
