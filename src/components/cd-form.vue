<template>
  <div class="cd-form">
    <slot name="header"></slot>
     <form class="cd-form--content" :class="formclass" v-on:submit.prevent="validateform">
      <cd-fieldset class="cd-fieldset--root border-0" :resolvevalue="resolvevalue" :class="rootclass" :descriptor="descriptor" :isvisible="isvisible" :readonly="isreadonly">
          <template slot-scope="{ property, parent }">
            <template v-if="property">
              <slot :property="property" :parent="parent">
                <cd-cell class="cd-field" :property="property"
                  :class="property.class" :onchange="onchange" :onblur="onblur" :onclear="onclear" :oninput="oninput" :onfocus="onfocus"
                  :onselect="onselect" :disabled="!editmode" :value="formobject[property.datafield]" :revert="revert">
                  <el-popover slot="label" :disabled="true">
                    <label slot="reference" class="cd-label form-label mb-0 user-select-none" :for="property.datafield">{{ property.text }}</label>
                  </el-popover>
                </cd-cell>
              </slot>
            </template>
          </template>
        </cd-fieldset>
      <div v-if="showcontrols && editmode" class="cd-form--buttons">
        <button class="btn btn-primary btn-sm ms-2 cd-reset-button" v-on:click="applychanges($event, payload, formobject)">{{ resettext }}</button>
        <button class="btn btn-primary btn-sm ms-2 cd-submit-button" v-on:click="applychanges($event, formobject, payload)" v-bind:disabled="!haschange">{{ submittext }}</button>
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
    resettext: { type: String, default: 'Сбросить' },
    submittext: { type: String, default: 'Отправить' },
    formclass: { type: String, default: '' },
    rootclass: { type: String, default: '' },
    onpropertychange: {
      type: Function,
      default: function (property, value) {
        const form = this
        Vue.set(form.formobject, property.datafield, value)
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
    switchmode: { type: Function, default: function () { } },
    showcontrols: { type: Boolean, default: false }
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
    }
  },
  methods: {
    validateform (...args) {
    },
    onchange ({ $event, property }, callback) {
      let newvalue = {}
      let reload = true
      if (property.input === 'select') {
        if ($event.type === 'error') {
          reload = false
          $event.reload()
        } else {
          newvalue = (($event || {})[property.valuekey]) || null
        }
      } else if (typeof $event === 'boolean' || $event === null | $event.type !== 'change') {
        newvalue = $event
      } else {
        newvalue = $event.target.value
      }
      if (reload) this.onpropertychange(property, newvalue)
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onblur ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    oninput ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onclear ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onfocus ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    onselect ({ $event, property }, callback) {
      Vue.set(this.formobject, property.datafield, $event[property.labelkey])
      if (callback) callback.call(property, this.formobject, $event, this)
    },
    applychanges (event, source, target) {
      const form = this
      form.flatprops.forEach((property) => {
        if (property.datafield) {
          Vue.set(target, property.datafield, (source[property.datafield] || null))
        }
      })
      if (event.target.classList.contains('cd-reset-button')) {
        form.revert = true
      }
      Vue.nextTick().then(() => form.switchmode())
    }
  },
  data: function (form) {
    return {
      formobject: Object.assign({}, form.payload),
      haschange: false,
      revert: false
    }
  },
  watch: {
    formobject: {
      deep: true,
      handler (newvalue, oldvalue) {
        this.haschange = true
      }
    },
    editmode: {
      handler (newvalue) {
        if (newvalue) {
          this.revert = false
        } else {
          this.revert = true
        }
      }
    }
  }
}
</script>

<style>
  .cd-form {
    text-align: left;
  }
</style>
<style scoped>
  label {
    font-weight: bold;
    white-space: nowrap;
  }
  label::after {
    content: ":";
    margin-right: 5px;
  }
</style>
