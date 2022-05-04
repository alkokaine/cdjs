<template>
  <cd-list class="cd-props" :collection="descriptor" keyfield="datafield" :listclass="['list-unstyled m-0 text-start', parentclass]" :showitems="hasdata">
    <span v-if="!hasdata" slot="header">
      н/д
    </span>
    <template slot-scope="{ row }">
      <cd-props v-if="row.descriptor" :descriptor="row.descriptor" :payload="payload" :parentclass="row.class"></cd-props>
      <div v-else-if="row.datafield" class="cd-prop" :class="row.class">
        <template v-if="ishtml(payload[row.datafield])">
          <span v-html="payload[row.datafield]"></span>
        </template>
        <template v-else-if="isemail(row)">
          <a :href="email(payload[row.datafield])">{{ payload[row.datafield] }}</a>
        </template>
        <template v-else-if="iswww(row)">
          <a :href="payload[row.datafield]">{{ payload[row.datafield] }}</a>
        </template>
        <template v-else-if="isroute(row)">
          <router-link :to="row.route(payload)">{{ payload[row.datafield] }}</router-link>
        </template>
        <template v-else>
          {{ payload[row.datafield] }}
        </template>
      </div>
    </template>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
export default {
  name: 'cd-props',
  props: {
    descriptor: { type: Array, required: true },
    payload: { type: [Object, Error] },
    parentclass: { type: String, default: 'd-block' }
  },
  components: {
    'cd-list': CDList
  },
  data (props) {
    return {
      hasdata: props.payload !== null && props.payload !== undefined
    }
  },
  computed: {
    iswww () {
      return (property) => property.format === 'www'
    },
    isemail () {
      return (property) => property.format === 'email'
    },
    email () {
      return (value) => `mailto:${value}`
    },
    isroute () {
      return (property) => property.route !== undefined
    }
  },
  methods: {
    ishtml (string) {
      var doc = new DOMParser().parseFromString(string, 'text/html')
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1)
    }
  }
}
</script>

<style>
  .cd-prop {
    padding-left: 0.2rem;
  }
</style>
