<template>
  <div class="cd-form">
    <slot name="header">
      {{ formpayload }}
    </slot>
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
      return (property) => utils.ispropertyvisible(property, null, this.formpayload)
    },
    iseditable () {
      return (property) => utils.ispropertyeditable(property, null, this.formpayload)
    },
    propertyconfig () {
      return (property) => utils.propertyconfig.call(this, property, this.formpayload, this.editmode, undefined)
    }
  },
  data: function (form) {
    return {
      formpayload: form.payload
    }
  }//,
  // watch: {
  //   payload: {
  //     immediate: true,
  //     handler (newvalue) {
  //       this.formpayload = newvalue
  //     }
  //   }
  // }
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
