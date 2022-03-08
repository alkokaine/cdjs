<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="form"></cd-info>
    <cd-form :descriptor="descriptor" :payload="test" :onpropertychange="onpropertychange"></cd-form>
  </div>
</template>

<script>

import CDForm from '@/components/cd-form.vue'
import CDDocGeneric from '@/generic/cd-doc-generic.vue'
import ComponentInfo from '@/generic/cd-doc-component-info.vue'

export default {
  components: { 'cd-doc': CDDocGeneric, 'cd-info': ComponentInfo, 'cd-form': CDForm },
  data (doc) {
    return {
      form: CDForm,
      test: {
        date: new Date(Date.now())
      },
      descriptor: [
        {
          datafield: 'date',
          text: 'дата',
          input: 'date'
        }
      ],
      content: [
        {
          id: 'form-1',
          header: 'CD-FORM'
        }
      ]
    }
  },
  methods: {
    onpropertychange (...args) {
      console.log(args)
    }
  }
}
</script>

<style>

</style>
