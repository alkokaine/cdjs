<template>
  <div class="cd-form">
    <slot name="header"></slot>
    <div class="cd-form-container">
      <slot name="header"></slot>
      <form class="cd-form--content" :class="formclass" v-on:submit.prevent="validateform">
        <slot>
          <template v-if="descriptor.length">
              <cd-fieldset class="cd-fieldset--root border-0" :class="rootclass" :descriptor="descriptor"
                :isvisible="isvisible"
                :readonly="isreadonly"
                :inline="inline"
                :propertyconfig="propertyconfig"></cd-fieldset>
          </template>
          <template v-else>
              <span>Напишите в внутри тэга cd-form содержимое формы, или используйте свойство descriptor для встроенного рендеринга</span>
          </template>
        </slot>
      </form>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
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
    inline: { type: Boolean, default: false, description: 'fieldset рисуется с display: flex, flex-wrap, flex-grow' },
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
    isvisible () {
      return (property) => utils.ispropertyvisible(property, null, this.payload)
    },
    isreadonly () {
      return (property) => !utils.ispropertyeditable(property, null, this.payload)
    },
    propertyconfig () {
      return (property) => utils.propertyconfig.call(this, property, this.payload, this.editmode, undefined)
    }
  },
  methods: {
    validateform (...args) {
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
  .cd-field {
    padding-left: 5px;
    padding-left: 5px;
  }
  .form-control-sm {
    min-height: calc(0.8em + 0.5rem + 2px);
  }
  .cd-form--content > .cd-fieldset--root {
    border: unset!important;
  }
</style>
