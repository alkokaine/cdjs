<template>
  <div class="cd-form">
    <slot name="header"></slot>
    <div class="cd-form-container">
      <slot name="header"></slot>
      <form class="cd-form--content" :class="formclass" v-on:submit.prevent="validateform">
        <slot>
          <template v-if="descriptor.length">
              <cd-fieldset class="cd-fieldset--root border-0" :resolvevalue="resolvevalue" :class="rootclass" :descriptor="descriptor"
                :isvisible="isvisible"
                :readonly="isreadonly"
                :editmode="editmode"
                :onchange="onchange"
                :onclear="onclear"
                :onfocus="onfocus"
                :oninput="oninput"
                :onblur="onblur"
                :onselect="onselect"
                :propertyconfig="propertyconfig"
                :resolvefieldclass="resolvefieldclass"></cd-fieldset>
          </template>
          <template v-else>
              <span>Напишите внутри тэга cd-form содержимое формы, или передайте массив дескрипторов свойство в свойство descriptor для встроенного рендеринга</span>
          </template>
        </slot>
      </form>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import utils from '../common/utils'
import fieldset from './cd-fieldset.vue'

export default {
  name: 'cd-form',
  components: {
    'cd-fieldset': fieldset
  },
  props: {
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
    editmode: { type: Boolean, default: true }
  },
  computed: {
    resolvevalue () {
      const form = this
      return (property) => (form.payload || {})[property.datafield]
    },
    descriptorproperty () {
      const form = this
      return (property) => (name) => utils.resolvePropertyValue(property, name, form.payload)
    },
    isvisible () {
      return (property) => utils.ispropertyvisible(property, null, this.payload)
    },
    isreadonly () {
      return (property) => !utils.ispropertyeditable(property, null, this.payload)
    },
    propertyconfig () {
      return (property) => utils.propertyconfig.call(this, property, this.payload, this.editmode, undefined)
    },
    resolvefieldclass () {
      const form = this
      return (prop) => {
        if (typeof prop.fieldclass === 'function') return prop.fieldclass(form.payload)
        return prop.fieldclass
      }
    }
  },
  methods: {
    validateform (...args) {
    },
    onchange ({ $event, property }, callback) {
      if ($event === null || $event.type !== 'change') {
        Vue.set(this.payload, property.datafield, $event)
      } else {
        Vue.set(this.payload, property.datafield, $event.target.value)
      }
      if (callback) callback.call(property, this.payload, $event)
    },
    onblur ({ $event, property }, callback) {
      console.log($event)
      console.log(property)
      if (callback) callback.call(property, this.payload, $event)
    },
    oninput ({ $event, property }, callback) {
      if (callback) callback.call(property, this.payload, $event)
    },
    onclear ({ $event, property }, callback) {
      console.log($event)
      console.log(property)
      if (callback) callback.call(property, this.payload, $event)
    },
    onfocus ({ $event, property }, callback) {
      if (callback) callback.call(property, this.payload, $event)
    },
    onselect ({ $event, property }, callback) {
      Vue.set(this.payload, property.datafield, $event[property.labelkey])
      if (callback) callback.call(property, this.payload, $event)
    }
  },
  data: function (form) {
    return {
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
