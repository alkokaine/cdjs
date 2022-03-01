<template>
  <cd-list listclass="cd-doc-generic" :collection="content" keyfield="contentid">
    <cd-part class="cd-doc-part" slot-scope="docpart" :part="docpart.row">
      <template v-if="docpart.row.subs">
        <cd-doc :content="docpart.row.subs"></cd-doc>
      </template>
    </cd-part>
  </cd-list>
</template>

<script>
import CDList from '@/components/cd-list.vue'
import CDPart from '@/generic/cd-part-generic.vue'
export default {
  name: 'cd-doc',
  components: {
    'cd-list': CDList,
    'cd-part': CDPart
  },
  props: {
    content: { type: Array, required: true }
  }
}
</script>

<style>
  .cd-doc-generic {
    list-style-type: none;
    margin-top: unset;
    padding-inline-start: unset;
  }
</style>
