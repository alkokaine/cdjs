<template>
  <cd-list :collection="tabs" keyfield="tabkey" listclass="nav nav-tabs mp3" :listrole="keyfield" :listitemclicked="ontabselected">
    <button slot-scope="scope" :ref="tabid(scope.index)" class="nav-link" role="tab" :class="{ 'active': scope.index === current }" :tabindex="scope.index">{{ scope.row.caption }}</button>
    <div class="tab-pane" slot="footer">
      <slot></slot>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
export default {
  name: 'cd-tabs',
  components: {
    'cd-list': CDList
  },
  props: {
    tabs: { type: Array, required: true, description: 'список вкладок' },
    ontabselected: { type: Function, required: true, description: 'Что произойдёт при выборе вкладки' },
    keyfield: { type: String, default: 'tabkey', description: 'Свойство-идентификатор вкладки' },
    current: { type: Number, default: 0, description: 'Выбранный индекс' }
  },
  data (tabcontrol) {
    return {
    }
  },
  computed: {
    tabid () {
      return (index) => `tab${index}`
    }
  }
}
</script>

<style>

</style>
