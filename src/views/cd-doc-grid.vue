<template>
  <div>
    <cd-doc :content="doc"></cd-doc>
    <cd-info v-for="(info, index) in infos" :component="info" property="props" :key="index"></cd-info>
  </div>
</template>

<script>
import CDDocGeneric from '../generic/cd-doc-generic.vue'
import ComponentInfo from '../generic/cd-doc-component-info.vue'
import CDGrid from '../components/cd-grid.vue'

export default {
  name: 'cd-doc-grid',
  components: {
    'cd-doc': CDDocGeneric,
    'cd-info': ComponentInfo
  },
  data (view) {
    return {
      infos: CDGrid.mixins.concat(CDGrid),
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
