<template>
  <div class="cd-form">
    <slot name="header"></slot>
     <form class="cd-form--content" :class="formclass" v-on:submit.prevent="validateform">
      <slot>
        <template v-if="descriptor.length">
            <cd-fieldset class="cd-fieldset--root border-0" :resolvevalue="resolvevalue" :class="rootclass" :descriptor="descriptor"
              :isvisible="isvisible"
              :readonly="isreadonly"
              :editmode="editmode"
              :resolvefieldclass="resolvefieldclass">
              <div slot-scope="{ property }">
                <cd-cell v-if="property" class="cd-field" :property="property"
                  :class="property.class" :onchange="onchange" :onblur="onblur" :onclear="onclear" :oninput="oninput" :onfocus="onfocus"
                  :onselect="onselect" :disabled="!editmode" :payload="formobject" :value="formobject[property.datafield]" :revert="revert">
                  <el-popover slot="label" :disabled="property.isvalid">
                    <label slot="reference" class="cd-label form-label mb-0" :for="property.datafield">{{ property.text }}</label>
                  </el-popover>
                </cd-cell>
              </div>
            </cd-fieldset>
        </template>
        <template v-else>
            <span>Напишите внутри тэга cd-form содержимое формы, или передайте массив дескрипторов свойство в свойство descriptor для встроенного рендеринга</span>
        </template>
      </slot>
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
import fieldset from './cd-fieldset.vue'
import CdCell from './cd-cell.vue'

export default {
  name: 'cd-form',
  components: {
    'cd-fieldset': fieldset,
    'cd-cell': CdCell
  },
  props: {
    resettext: { type: String, default: 'Сбросить' },
    submittext: { type: String, default: 'Отправить' },
    formclass: { type: String, default: '' },
    rootclass: { type: String, default: '' },
    onpropertychange: { type: Function, required: true, description: 'Функция, которая выполнится при изменении свойства объекта payload' },
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
      if (property.input === 'select') {
        Vue.set(this.formobject, property.datafield, $event[property.valuekey])
      } else if (typeof $event === 'boolean' || $event === null || $event.type !== 'change') {
        Vue.set(this.formobject, property.datafield, $event)
      } else {
        Vue.set(this.formobject, property.datafield, $event.target.value)
      }
      if (callback) callback.call(property, this.formobject, $event)
    },
    onblur ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event)
    },
    oninput ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event)
    },
    onclear ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event)
    },
    onfocus ({ $event, property }, callback) {
      if (callback) callback.call(property, this.formobject, $event)
    },
    onselect ({ $event, property }, callback) {
      Vue.set(this.formobject, property.datafield, $event[property.labelkey])
      if (callback) callback.call(property, this.formobject, $event)
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
</style>
