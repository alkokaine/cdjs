<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="form"></cd-info>
  </div>
</template>

<script>

import CDForm from '../components/cd-form.vue'
import CDDocGeneric from '../generic/cd-doc-generic.vue'
import ComponentInfo from '../generic/cd-doc-component-info.vue'

export default {
  components: { 'cd-doc': CDDocGeneric, 'cd-info': ComponentInfo },
  data (doc) {
    return {
      form: CDForm,
      content: [
        {
          id: 'menu-1',
          header: 'CD-FORM'
        }
      ]
    }
  }
}
</script>

<style>

</style>
