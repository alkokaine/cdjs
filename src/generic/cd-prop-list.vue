<template>
  <cd-list class="cd-properties" listclass="property-list" :collection="descriptor" keyfield="datafield" :listitemclicked="onpropertyclick">
    <div class="property-descriptor" slot-scope="property">
      <button type="button" class="btn btn-link btn-sm bi bi-x-circle" v-on:click.stop="removeproperty($event, property.index)" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"></button>
      <button type="button" class="property-descriptor btn btn-link btn-sm">{{ property.row.datafield }}</button>
    </div>
    <template slot="placeholder">
      <button type="button" class="btn btn-link btn-sm" v-on:click="generateproperties" data-bs-toggle="tooltip" data-bs-placement="top" title="Существующие дескприпторы будут удалены и заменены базовыми дескрипторами свойств первого объекта в коллекции">Сгенерировать колонки автоматически</button>
      <button type="button" class="btn btn-link btn-sm" v-on:click="addproperty">Добавить колонку</button>
    </template>
  </cd-list>
</template>

<script>
import CDList from '../components/cd-list.vue'
export default {
  name: 'cd-prop-list',
  components: {
    'cd-list': CDList
  },
  props: {
    descriptor: { type: Array, required: true },
    generateproperties: { type: Function, required: true }
  },
  methods: {
    removeproperty (event, args) {
      this.descriptor.splice(args, 1)
    },
    onpropertyclick (...args) {
      console.log(args)
    },
    addproperty (...args) {
      console.log(args)
    }
  }
}
</script>

<style>
  ul.property-list {
    list-style-type: none;
  }
  .property-descriptor {
    padding-right: 5px;
  }
</style>
