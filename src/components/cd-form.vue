<template>
  <div class="cd-form">
    <slot name="header"></slot>
    <form class="cd-form--content" v-on:submit.prevent="validateform">
      <slot>
        <template v-if="descriptor.length">
            <cd-fieldset :descriptor="descriptor"
              :isvisible="isvisible"
              :iseditable="iseditable"
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
    iseditable () {
      return (property) => utils.ispropertyeditable(property, null, this.payload)
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
</style>
