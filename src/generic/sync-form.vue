<template>
  <cd-list :collection="values" keyfield="key" listclass="list-unstyled d-flex" rowclass="w-50 m-3">
    <cd-form :id="row.key" slot-scope="{ row }" :descriptor="row.descriptor" :payload="row.payload" :sync="row.sync" :showcontrols="!row.sync"
             :submit="onSubmit(row)" :reset="onReset(row)"
    >
      <div slot="header" slot-scope="{ model }">{{ model }}</div>
      <div slot="footer" class="payload-value p-3">{{ row.payload }}</div>
    </cd-form>
  </cd-list>
</template>
<script>
import CDList from '../components/cd-list.vue'
import CDForm from '../components/cd-form.vue'
export default {
  name: 'SyncForm',
  components: {
    'cd-list': CDList,
    'cd-form': CDForm
  },
  props: {
    values: { type: Array, required: true },
    submit: { type: Function },
    reset: { type: Function }
  },
  computed: {
    onSubmit ({ submit }) {
      return (row) => submit(row)
    },
    onReset ({ reset }) {
      return (row) => reset(row)
    }
  }
}
</script>