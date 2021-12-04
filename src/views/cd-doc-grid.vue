<template>
  <cd-list :collection="doc" keyfield="id">
    <div class="cd-grid--main" slot="header">
      <span class="h3">cd-grid</span>
    </div>
    <div class="cd-grid--part" slot-scope="info">
      {{ info }}
    </div>
  </cd-list>
</template>

<script>
import CDList from '../components/cd-list.vue'
export default {
  name: 'cd-doc-grid',
  components: {
    'cd-list': CDList
  },
  data (view) {
    return {
      doc: [
        {
          id: 'grid-a',
          header: 'AA'
        },
        {
          id: 'grid-b',
          header: 'BB'
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
