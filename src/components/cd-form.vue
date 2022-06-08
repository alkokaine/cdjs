<template>
  <div class="cd-form">
    <slot name="header"></slot>
    <form :name="name" v-loading="revert" class="cd-form--content" v-on:submit.prevent>
      <cd-fieldset class="cd-fieldset--root border-0" :resolvevalue="resolvevalue" :descriptor="descriptor" :isvisible="isvisible" :readonly="isreadonly">
        <template slot-scope="{ property, parent }">
          <template v-if="property">
            <slot :property="property" :parent="parent">
              <cd-cell class="cd-field" :property="property" :class="property.class" :onchange="onchange" :parent="self"
                :onblur="onblur" :onclear="onclear" :oninput="oninput" :onfocus="onfocus" :onselect="onselect" :resolvepayload="resolvefetchdata(property)"
                :disabled="!editmode" v-model.lazy="formobject[property.datafield]" :revert="revert" :required="isrequired(property)"
                :isoptiondisabled="resolveoptiondisabled(property)">
                <el-popover slot="label" :disabled="true">
                  <label tabindex="-1" slot="reference" class="cd-label form-label mb-0 user-select-none" :for="property.datafield">{{ property.text }}</label>
                </el-popover>
              </cd-cell>
            </slot>
          </template>
        </template>
      </cd-fieldset>
      <div class="cd-form--controls" v-if="showcontrols">
        <button class="btn btn-sm btn-outline-secondary mx-1 cd-reset--button" type="reset" v-on:click="onreset({ $event, payload }, reset)">
          <slot name="reset">{{ resettext }}</slot>
        </button>
        <button class="btn btn-primary btn-sm mx-1" type="submit" v-on:click="onsubmit({ $event, payload: formobject }, submit)">
          <slot name="submit">{{ submittext }}</slot>
        </button>
      </div>
    </form>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import Vue from 'vue'
import utils from '../common/utils'
import CDFieldset from './cd-fieldset.vue'
import CDCell from './cd-cell.vue'
export default {
  name: 'cd-form',
  components: {
    'cd-fieldset': CDFieldset,
    'cd-cell': CDCell
  },
  props: {
    resettext: { type: String, default: 'Отменить' },
    submittext: { type: String, default: 'Отправить' },
    name: { type: String },
    formclass: { type: String, default: '' },
    rootclass: { type: String, default: '' },
    onpropertychange: {
      type: Function,
      default: function (property, value) {
        // const form = this
        // Vue.set(form.formobject, property.datafield, value)
      },
      description: 'Функция, которая выполнится при изменении свойства объекта payload'
    },
    payload: { type: Object, required: true, description: 'Объект, который размещается на форме' },
    descriptor: {
      type: Array,
      default: function () {
        return []
      },
      description: 'Массив объектов-дескрипторов свойств объекта, который будет показан на форме'
    },
    editmode: { type: Boolean, default: true },
    showcontrols: { type: Boolean, default: false },
    reset: {
      type: Function,
      default: function ({ $event, payload }) {
        console.log('reset ', $event, payload)
      }
    },
    submit: {
      type: Function,
      default: function ({ $event, payload }) {
        console.log('submit ', $event, payload)
      }
    },
    sync: {
      type: Boolean,
      default: false,
      description: 'Синхронизировать ли свойства входного объекта со сначениями на форме при редактировании'
    }
  },
  computed: {
    flatprops () {
      return utils.flatterer(this.descriptor, [])
    },
    resolvevalue () {
      const form = this
      return (property) => (form.formobject || {})[property.datafield]
    },
    descriptorproperty () {
      const form = this
      return (property) => (name) => utils.resolvePropertyValue(property, name, form.formobject)
    },
    isvisible () {
      return (property) => utils.ispropertyvisible(property, null, this.formobject)
    },
    isreadonly () {
      return (property) => !utils.ispropertyeditable(property, null, this.formobject)
    },
    resolvefieldclass () {
      const form = this
      return (prop) => {
        if (typeof prop.fieldclass === 'function') return prop.fieldclass(form.formobject)
        return prop.fieldclass
      }
    },
    isrequired () {
      const form = this
      return (prop) => {
        if (typeof prop.required === 'function') return prop.required(form.formobject)
        return prop.required
      }
    }
  },
  methods: {
    resolveoptiondisabled (property) {
      const form = this
      return (option) => {
        if (Object.prototype.hasOwnProperty.call(property, 'isdisabled') && typeof property.isdisabled === 'function') {
          return property.isdisabled(option, form.formobject, form)
        }
        return false
      }
    },
    resolvefetchdata (property) {
      const form = this
      if (['autocomplete', 'select'].includes(property.input)) {
        return (query) => {
          if (Object.prototype.hasOwnProperty.call(property, 'resolvepayload') && typeof property.resolvepayload === 'function') {
            return property.resolvepayload(query, form.formobject, form)
          }
        }
      }
    },
    onsubmit (args, callback) {
      callback(args)
    },
    onreset (args, callback) {
      this.formobject = Object.assign({}, args.payload)
      callback(args)
    },
    onchange ({ $event, property }, callback) {
      let newvalue = {}
      if (property.input === 'select') {
        if ($event !== null && $event !== undefined && $event.type === 'error') {
          const attemp = ((property.payload || {})).attemp || 0
          Vue.set(property, 'payload', { attemp: attemp + 1 })
        } else {
          if (Array.isArray($event)) {
            newvalue = $event
          } else {
            newvalue = (($event || {})[property.valuekey]) || null
          }
        }
      } else if (property.input === 'date' || property.input === 'datetime') {
        newvalue = (new Date($event)).toISOString()
      } else if (typeof $event === 'boolean' || $event === null | $event.type !== 'change') {
        newvalue = $event
      } else {
        newvalue = $event.target.value
      }
      this.haschange = true
      if (this.formobject[property.datafield] !== newvalue) {
        Vue.set(this.formobject, property.datafield, newvalue)
      }
      if (callback) callback.call(property, this.formobject, newvalue, this)
    },
    onblur ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    oninput ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onclear ({ $event, property }, callback) {
      Vue.set(this.formobject, property.datafield, null)
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onfocus ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onselect ({ $event, property }, callback) {
      // Vue.set(this.formobject, property.datafield, $event[property.labelkey])
      if (callback) callback.call(property, this.formobject, $event, this)
    }
  },
  data: function (form) {
    return {
      formobject: form.sync ? form.payload : Object.assign({}, form.payload),
      haschange: false,
      revert: false,
      self: form
    }
  },
  watch: {
    editmode: {
      handler (newvalue) {
        this.revert = !newvalue
      }
    },
    revert: {
      handler (newvalue) {
        const form = this
        if (newvalue) {
          setTimeout(() => {
            form.revert = false
          }, 150)
        }
      }
    }
  }
}
</script>

<style>

</style>
<style scoped>
  label {
    font-weight: bold;
  }
  label::after {
    content: ":";
  }
  .cd-form {
    text-align: left;
  }
  .cd-form--controls {
    text-align: right;
  }
  .el-popper {
    min-width: unset!important;
  }
</style>
