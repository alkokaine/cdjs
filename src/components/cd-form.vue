<template>
  <div class="cd-form" :class="rootclass">
    <slot name="header" :model="formobject"></slot>
    <el-form :model="formobject" size="mini" ref="innerform" :name="name" class="cd-form--content" :class="formclass" :rules="rules" @submit.native.prevent @reset.native.prevent>
      <div slot="title">{{ hasChanges }}</div>
      <cd-fieldset v-if="!revert" class="cd-fieldset--root border-0" :resolvevalue="resolvevalue" :descriptor="descriptor" :isvisible="isvisible" :readonly="isreadonly">
        <template slot-scope="{ property, parent }">
          <template v-if="property">
            <el-form-item class="cd-cell mb-2" :error="propertyerror(property)" :prop="property.datafield" :class="{ 'd-block': property.input === 'textarea' }" :required="isrequired(property)" :for="property.datafield">
              <span slot="label" tabindex="-1" class="cd-label form-label mb-0 fw-bold user-select-none">{{ property.text }}</span>
              <slot :property="property" :parent="parent">
                <cd-cell :property="property" :class="property.class" :onchange="onchange" :parent="self"
                  :onblur="onblur" :onclear="onclear" :oninput="oninput" :onfocus="onfocus" :onselect="onselect" :resolvepayload="resolvefetchdata(property)"
                  :disabled="!ispropertyeditable(property)" :value="formobject[property.datafield]" :revert="revert"
                  :isoptiondisabled="resolveoptiondisabled(property)">
                </cd-cell>
              </slot>
            </el-form-item>
          </template>
        </template>
      </cd-fieldset>
      <slot name="footer" :model="formobject"></slot>
      <div class="cd-form--controls" v-if="showcontrols">
        <button class="btn btn-sm btn-outline-secondary mx-1 cd-reset--button" type="reset" v-on:click="resetForm({ $event, payload }, reset)">
          <slot name="reset">{{ resettext }}</slot>
        </button>
        <button class="btn btn-primary btn-sm mx-1" v-on:click="submitForm({ $event, payload: formobject }, submit)">
          <slot name="submit">{{ submittext }}</slot>
        </button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import utils from '../common/utils'
import CDFieldset from './cd-fieldset.vue'
import CDCell from './cd-cell.vue'

const hasOwnProperty = Object.prototype.hasOwnProperty
const isFunction = function (check) {
  return (typeof this[check] === 'function')
}

export default {
  name: 'cd-form',
  components: {
    'cd-fieldset': CDFieldset,
    'cd-cell': CDCell
  },
  props: {
    validate: { type: Boolean, default: true },
    resettext: { type: String, default: 'Отменить' },
    submittext: { type: String, default: 'Отправить' },
    errors: {
      type: Array,
      default: function () {
        return []
      }
    },
    name: { type: String },
    formclass: { type: String, default: 'cd-form--inner' },
    rootclass: { type: String, default: 'cd-form' },
    onpropertychange: {
      type: Function,
      description: 'Функция, которая выполнится при изменении свойства объекта formobject'
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
    resetForm ({ $nextTick, $refs, setRevert, setFormObject, sync, setHasChanges }) {
      return ({ $event, payload}, callback) => {
        $nextTick()
          .then(() => setRevert(true))
          .then(() => setFormObject(payload, sync))
          .then(() => setHasChanges(false))
          .then(() => callback({ payload }))
          .then(() => setRevert(false))
      }
    },
    submitForm ({ $refs, setHasChanges, $alert, payload }) {
      return (args, callback) => {
        console.log(args.payload, payload)
        $refs.innerform.validate(result => {
          if (result == false) {
            $alert('Обнаружены ошибки!', 'Внимание', {
              confirmButtonText: 'ОК'
            })
          } else {
            callback({ payload: args.payload })
          }
        })
      }
    },
    propertyerror ({ errors }) {
      return (property) => {
        const propertyerrors = errors.filter(f => f.property === property.datafield)
        const text = propertyerrors.reduce((prev, current) => prev.concat(current.error), '')
        return text
      }
    },
    flatprops ({ descriptor }) {
      return utils.flatterer(descriptor, [])
    },
    ispropertyeditable ({ editmode, formobject }) {
      return (property) => editmode && utils.ispropertyeditable(property, formobject)
    },
    rules ({ flatprops, formobject }) {
      const rulesContainer = {}
      flatprops.forEach(property => {
        if (hasOwnProperty.call(property, 'datafield') && hasOwnProperty.call(property, 'rules')) {
          Vue.set(rulesContainer, property.datafield, isFunction.call(property, 'rules') ? property.rules(formobject) : property.rules)
        }
      })
      return rulesContainer
    },
    resolvevalue ({ formobject }) {
      return (property) => (formobject || {})[property.datafield]
    },
    descriptorproperty ({ formobject }) {
      return (property) => (name) => utils.resolvePropertyValue(property, name, formobject)
    },
    isvisible ({ formobject }) {
      return (property) => utils.ispropertyvisible(property, null, formobject)
    },
    isreadonly ({ formobject }) {
      return (property) => !utils.ispropertyeditable(property, null, formobject)
    },
    resolvefieldclass ({ formobject }) {
      return (prop) => {
        if (typeof prop.fieldclass === 'function') return prop.fieldclass(formobject)
        return prop.fieldclass
      }
    },
    isrequired ({ formobject }) {
      return (prop) => {
        if (typeof prop.required === 'function') return prop.required(formobject)
        return prop.required
      }
    }
  },
  methods: {
    setHasChanges (hasChanges) {
      this.hasChanges = hasChanges
    },
    setRevert (isRevert) {
      const form = this
      return Promise.resolve(form.$nextTick().then(() => {
        form.revert = isRevert
      }))
    },
    setFormObject(object, sync) {
      const form = this
      return Promise.resolve(form.$nextTick().then(() => { 
        if (typeof object != 'function') {
          form.formobject = sync ? object : ({ ...object })
        } else {
          form.formobject = object
        }
      }))
    },
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
      this.$refs.innerform.validate((valid) => {
        if (valid) {
          callback(args)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onchange ({ $event, property }, callback) {
      const form = this
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
      if (callback) callback.call(property, this.formobject, ['select', 'autocomplete'].includes(property.input) ? $event : newvalue, this)
      if (form.onpropertychange !== undefined) form.onpropertychange(property, form.formobject)
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
      if (callback) callback.call(property, this.formobject, $event, this)
    }
  },
  data: function (form) {
    return {
      formobject: form.sync ? form.payload : Object.assign({}, { ...form.payload }),
      hasChanges: false,
      revert: false,
      self: form,
      validateinfo: []
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
  /* .el-form-item__error {
    position: inherit!important;
  } */
</style>
