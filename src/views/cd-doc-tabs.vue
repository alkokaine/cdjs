<template>
  <cd-info property="props" :component="tabs"></cd-info>
</template>

<script>
import ComponentInfo from '../generic/cd-doc-component-info.vue'
import CDTabs from '@/components/cd-tabs.vue'
export default {
  components: {
    'cd-info': ComponentInfo
  },
  data (doc) {
    return {
      tabs: CDTabs
    }
  }
}
</script>

<style>

</style>
