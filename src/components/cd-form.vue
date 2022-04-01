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
                :onpropertychange="onpropertychange"
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
    propertychange (property, event) {
      Promise.resolve(() => {
        Vue.set(this.payload, property.datafield, event)
        return { property, event }
      }).then()
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
