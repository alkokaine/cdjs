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
        },
        {
          datafield: 'number',
          text: 'number',
          input: 'number'
        },
        {
          datafield: 'textarea',
          text: 'textarea',
          input: 'textarea'
        },
        {
          datafield: 'slider',
          text: 'slider',
          input: 'slider',
          min: 0,
          max: 100,
          range: false,
          showinput: true,
          showcontrols: false
        },
        {
          datafield: 'checkbox',
          text: 'checkbox',
          input: 'checkbox'
        },
        {
          datafield: 'switch',
          text: 'switch',
          input: 'switch'
        },
        {
          text: 'Legend',
          descriptor: [
            {
              datafield: 'slider1',
              text: 'slider',
              input: 'slider',
              min: 0,
              max: 100,
              range: false,
              showinput: true,
              showcontrols: false
            },
            {
              datafield: 'checkbox1',
              text: 'checkbox',
              input: 'checkbox'
            },
            {
              datafield: 'switch1',
              text: 'switch',
              input: 'switch'
            }
          ]
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
      // console.log(args)
    }
  }
}
</script>

<style>

</style>
