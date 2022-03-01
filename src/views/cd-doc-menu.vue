<template>
  <div>
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="menu"></cd-info>
  </div>
</template>

<script>

import CDMenu from '@/components/cd-menu.vue'
import CDDocGeneric from '@/generic/cd-doc-generic.vue'
import ComponentInfo from '@/generic/cd-doc-component-info.vue'

export default {
  components: { 'cd-doc': CDDocGeneric, 'cd-info': ComponentInfo },
  data (doc) {
    return {
      menu: CDMenu,
      content: [
        {
          id: 'menu-1',
          header: 'CD-MENU'
        }
      ]
    }
  }
}
</script>

<style>

</style>
