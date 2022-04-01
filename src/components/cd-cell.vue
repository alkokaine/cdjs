<template>
  <div class="cd-cell ms-2 me-2" :class="{ 'd-block': editortype.istextarea, 'is-readonly': readonly }">
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
          v-on:change="onchage({ $event, property }, property.onchage)" v-on:focus="onfocus({ $event, property }, property.onfocus)" v-on:blur="onblur({ $event, property }, property.onblur)" v-on:input="oninput({ $event, property }, property.oninput)">
          <el-option slot-scope="option">
              <cd-props v-if="property.slotdescriptor" :payload="option.row" :descriptor="property.slotdescriptor"></cd-props>
              <span v-else>{{ option.row[property.labelkey] }}</span>
          </el-option>
        </el-autocomplete>
      </template>
      <template v-else-if="editortype.isdate">
        <el-date-picker class="w-100" :disabled="disabled" size="mini" v-model="cellvalue" :placeholder="property.placeholder" :clearable="property.clearable"
          :format="property.displayformat" value-format="timestamp"
          :editable="property.editable" :align="property.align" :name="property.datafield" :picker-options="pickeroptions"
          v-on:change="onchange({ $event, property },  property.onchange)"
          v-on:blur="onblur({ $event, property }, property.onblur)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:input="oninput({ $event, property }, property.oninput)">
        </el-date-picker>
      </template>
      <template v-else-if="editortype.isdatetime"></template>
      <div v-else-if="editortype.isnumber" class="el-input--mini w-100">
        <input :disabled="disabled" class="el-input__inner" type="number" v-model="cellvalue"
          :clearable="property.clearable"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"
          v-on:change="onchange({ $event, property }, property.onchage)"
          v-on:blur="onblur({ $event, property }, property.onblur)"/>
      </div>
      <template v-else-if="editortype.ischeckbox">
        <el-checkbox class="cd-checkbox" size="mini" v-model="cellvalue" :disabled="disabled"></el-checkbox>
      </template>
      <template v-else-if="editortype.isfile"></template>
      <template v-else-if="editortype.istextarea">
        <el-input type="textarea" v-model="cellvalue"
          v-on:blur="onblur({ $event, property}, property.onblur)"
          v-on:change="onchange({ $event, property}, property.onchange)"
          v-on:input="oninput({ $event, property }, property.oninput)"
          v-on:focus="onfocus({ $event, property }, property.onfocus)"></el-input>
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
        <el-switch v-model="cellvalue" v-on:change="onchange({ $event, property }, property.onchage)"></el-switch>
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
    readonly: { type: Boolean, default: true }
  },
  data (cell) {
    return {
      isarray: Array.isArray(cell.value),
      cellvalue: cell.value,
      editortype: {
        isselect: cell.property.input === 'select',
        isautocomplete: cell.property.input === 'autocomplete',
        isdate: cell.property.input === 'date',
        isdatetime: cell.property.input === 'datetime',
        isnumber: cell.property.input === 'number',
        ischeckbox: cell.property.input === 'checkbox',
        isfile: cell.property.input === 'file',
        istextarea: cell.property.input === 'textarea',
        isslider: cell.property.input === 'slider',
        isswitch: cell.property.input === 'switch'
      },
      pickeroptions: cell.property.options,
      values: (cell.property.values || []),
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
    onchange (event, callback) {
      
      if (callback) callback.call(event.property, event.$event)

    },
    onvisiblechange (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    onremovetag (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    onclear (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    onblur (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    onfocus (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    oninput (event, callback) {
      if (callback) callback.call(event.property, event.$event)
    },
    fetchsuggestions (query, callback) {

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
