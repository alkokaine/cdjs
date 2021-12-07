<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info v-for="(o, index) in infos" property="props" :component="o" :key="index"></cd-info>
  </div>
</template>

<script>

import CDList from '../components/cd-list.vue'
import CDDocGeneric from '../generic/cd-doc-generic.vue'
import ComponentInfo from '../generic/cd-doc-component-info.vue'

export default {
  components: { 'cd-doc': CDDocGeneric, 'cd-info': ComponentInfo },
  data (doc) {
    return {
      infos: CDList.mixins.concat(CDList),
      content: [
        {
          id: 'list-1',
          header: 'Всё коллекция'
        }
      ]
    }
  }
}
</script>

<style>

</style>
