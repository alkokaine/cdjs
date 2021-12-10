<template>
  <div class="cd-form">
    <form class="cd-form--content">
      <slot>
        <template v-if="descriptor.length">
            <cd-fieldset :descriptor="descriptor" :isvisible="isvisible" :iseditable="iseditable" :propertyconfig="propertyconfig"></cd-fieldset>
        </template>
        <template v-else>
            <span>Напишите в внутри тэга cd-form содержимое формы, или используйте свойство descriptor для встроенного рендеринга</span>
        </template>
      </slot>
    </form>
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
    payload: { type: Object, required: true, description: 'Объект, который изначально размещается на форме' },
    descriptor: {
      type: Array,
      default: function () {
        return []
      }
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
