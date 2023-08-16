<template>
  <div class="cd-doc-part">
    <h3 v-html="part.header" />
    <span v-for="(description, index) in part.description" :key="index" v-html="description" />
    <span>{{ part.code }}</span><br>
    <cd-list :collection="part.info" keyfield="id">
      <cd-doc-part slot-scope="info" class="cd-part-info" :part="info.row" />
    </cd-list>
    <slot />
  </div>
</template>

<script>
import CDList from '@/components/cd-list.vue'
export default {
  name: 'CdDocPart',
  components: {
    'cd-list': CDList
  },
  props: {
    part: { type: Object, required: true }
  }
}
</script>

<style>
  .cd-doc-part {
    padding-top: 1em;
  }
</style>
