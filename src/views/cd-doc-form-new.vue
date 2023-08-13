<template>
  <cd-list :collection="controls" keyfield="key" listclass="list-unstyled p-3" rowclass="border m-3">
    <sync-form slot-scope="{ row, index }" :id="syncId(index)" :values="row.controls" :submit="submitRow" :reset="resetRow"></sync-form>
  </cd-list>
</template>
<script>
import CDList from '../components/cd-list.vue'
import SyncForm from '../generic/sync-form.vue'

const syncId = (index) => `form-item-${index}`
const submit = function (row, payload) {
  console.log(row.payload, payload)
}
const reset = function (row, payload) {
  console.log(row.payload, payload)
}
const submitRow = function (row) {
  return ({ payload }) => {
    submit(row, payload)
  }
}
const resetRow = function (row) {
  return ({ payload }) => {
    reset(row, payload)
  }
}
export default {
  name: 'cd-doc-form',
  components: {
    'cd-list': CDList,
    'sync-form': SyncForm
  },
  data () {
    return {
      submitRow,
      resetRow,
      controls: [
        {
          key: 'input',
          controls: [
            {
              key: 'input-sync',
              descriptor: [{ datafield: 'input', text: 'input-sync' }],
              payload: {},
              sync: true
            },
            {
              key: 'input',
              descriptor: [{ datafield: 'input', text: 'input' }],
              payload: {},
              sync: false,
            },
          ]
        },
        {
          key: 'textarea',
          controls: [
            {
              key: 'textarea-sync',
              descriptor: [{ datafield: 'textarea', text: 'textarea-sync', input: 'textarea' }],
              payload: {},
              sync: true
            },
            {
              key: 'input',
              descriptor: [{ datafield: 'textarea', text: 'textarea', input: 'textarea' }],
              payload: {},
              sync: false
            },
          ]
        },
        {
          key: 'datetime',
          controls: [
            {
              key: 'datetime-sync',
              descriptor: [{ datafield: 'datetime', text: 'datetime-sync', input: 'date' }],
              payload: {},
              sync: true
            },
            {
              key: 'datetime',
              descriptor: [{ datafield: 'datetime', text: 'datetime', input: 'date' }],
              payload: {},
              sync: false
            },
          ]
        },
        {
          key: 'select',
          controls: [
            {
              key: 'select-sync',
              descriptor: [{ datafield: 'select', text: 'select-sync', input: 'select', valuekey: 'id', labelkey: 'label', values: [{ id: 1, label: 'значение 1'},{ id: 2, label: 'значение 2'},{ id: 3, label: 'значение 3'}] }],
              payload: {},
              sync: true
            },
            {
              key: 'select',
              descriptor: [{ datafield: 'select', text: 'select', input: 'select', valuekey: 'id', labelkey: 'label', values: [{ id: 1, label: 'значение 1'},{ id: 2, label: 'значение 2'},{ id: 3, label: 'значение 3'}]  }],
              payload: {},
              sync: false
            },
          ]
        },
        {
          key: 'number',
          controls: [
            {
              key: 'number-sync',
              descriptor: [{ datafield: 'number', text: 'number-sync', input: 'number' }],
              payload: {},
              sync: true
            },
            {
              key: 'number',
              descriptor: [{ datafield: 'number', text: 'number', input: 'number' }],
              payload: {},
              sync: false
            },
          ]
        },
        {
          key: 'switch',
          controls: [
            {
              key: 'switch-sync',
              descriptor: [{ datafield: 'switch', text: 'switch-sync', input: 'switch' }],
              payload: {},
              sync: true
            },
            {
              key: 'switch',
              descriptor: [{ datafield: 'switch', text: 'switch', input: 'switch' }],
              payload: {},
              sync: false
            },
          ]
        }        
      ],
      syncId
    }
  }
}
</script>