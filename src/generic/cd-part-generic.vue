<template>
  <div class="cd-doc-part">
    <h3 v-html="part.header"></h3>
    <span v-for="(description, index) in part.description" :key="index" v-html="description"></span>
    <span>{{ part.code }}</span><br/>
    <cd-list :collection="part.info" keyfield="id">
      <cd-doc-part class="cd-part-info" slot-scope="info" :part="info.row"></cd-doc-part>
    </cd-list>
    <slot></slot>
  </div>
</template>

<script>
import CDList from '../components/cd-list.vue'
export default {
  name: 'cd-doc-part',
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
