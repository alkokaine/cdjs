<template>
  <cd-doc :content="doc"></cd-doc>
</template>

<script>
import CDDocGeneric from '../generic/cd-doc-generic.vue'

export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric
  },
  data (view) {
    return {
      doc: [
        {
          id: 'grid-a',
          header: 'CD-GRID',
          description: ['aaa']
        },
        {
          id: 'grid-b',
          header: 'BB',
          subs: [
            {
              id: 'grid-b-1',
              header: 'BB-1',
              info: [
                {
                  description: 'BB is BB and this is law',
                  code: 'here will be code (soon)'
                }
              ]
            },
            {
              id: 'grid-b-2',
              header: 'BB-2'
            },
            {
              id: 'grid-b-3',
              header: 'BB-3'
            }
          ]
        },
        {
          id: 'grid-c',
          header: 'CC'
        }
      ]
    }
  }
}
</script>

<style>

</style>
