<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="form"></cd-info>
    <cd-form :descriptor="descriptor" :payload="test" :onpropertychange="onpropertychange"></cd-form>
    {{ test }}
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
          input: 'date',
          onchange (payload, event) {
            console.log(this)
            console.log(payload)
            console.log(event)
          }
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
          showinput: false,
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
              datafield: 'address',
              text: 'address',
              input: 'autocomplete',
              method: 'post',
              labelkey: 'unrestricted_value',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Token 08ca729eaf9a69c5d90fd9bde48adb7d8131a60a'
              },
              data: (query) => ({
                query: query,
                count: 20
              }),
              focustrigger: false,
              clearable: true,
              url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
              resolveresult: (response) => (response.data.suggestions)
            },
            {
              datafield: 'simpleselect',
              text: 'select',
              input: 'select',
              values: [
                {
                  key: 1,
                  label: 'label 1'
                },
                {
                  key: 2,
                  label: 'label 2'
                },
                {
                  key: 3,
                  label: 'label 3'
                },
                {
                  key: 4,
                  label: 'label 4'
                }
              ],
              labelkey: 'label',
              valuekey: 'key'
            },
            {
              datafield: 'slider1',
              text: 'slider',
              input: 'slider',
              min: 0,
              max: 100,
              range: false,
              showinput: false,
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
