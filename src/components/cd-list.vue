<template>
  <div class="cd-list" v-on:mouseleave="listleave">
    <slot name="header"></slot>
    <ul v-if="showitems" class="cd-list--wrap" :class="[listclass, { 'inner': inner }]">
      <li v-for="(row, index) in list"
        :key="rowkey(row)" class="cd-list--item" :class="rowclassResolved(row)"
          v-on:click.stop="listitemclicked($event, { row, index })"
          v-on:mouseenter="listitementered($event, { row, index})">
        <div class="cd-list--item-content">
          <slot :row="row" :index="index"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import collection from '../common/collection'
import selection from '../common/selection'
export default {
  name: 'cd-list',
  mixins: [collection, selection],
  props: {
    showitems: { type: Boolean, default: true },
    onrowhover: { type: Function, default: function (event, row) {} },
    /**
     * строка или функция, возвращающая css-класс для для
     */
    listclass: { type: String },
    /**
     * строка или функция, возвращающая css-класс для строки коллекции
     */
    rowclass: { type: [String, Function], default: '' },
    listitemclicked: { type: Function, default: function (event, scope) {} },
    listitementered: { type: Function, default: function (event, scope) {} },
    listitemleaved: { type: Function, default: function (event, scope) {} },
    listleave: { type: Function, default: function (event) {} },
    listenter: { type: Function, default: function (event) {} }
  },
  computed: {
    rowclassResolved () {
      const list = this
      return (row) => {
        if (typeof list.rowclass === 'string') return list.rowclass
        return list.rowclass(row)
      }
    }
  }
}
</script>

<style>
  .cd-list--item {
    background-color: inherit;
  }
  .cd-list--wrap {
    background-color: inherit;
  }
</style>
