<template>
  <div class="cd-list" v-on:mouseleave="listleave">
    <slot name="header"></slot>
    <ul v-if="showitems" class="cd-list--wrap" :class="[listclass, { 'inner': inner }]">
      <li v-for="(row, index) in collection"
        :key="rowkey(row)" class="cd-list--item" :class="rowclassResolved(row)"
          v-on:click.stop="listitemclicked($event, { row, index })"
          v-on:mouseenter="listitementered($event, { row, index})">
        <div class="cd-list--item-content">
          <slot :row="row" :index="index"></slot>
        </div>
      </li>
    </ul>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import collection from '../common/collection'
import selection from '../common/selection'
export default {
  name: 'cd-list',
  mixins: [collection, selection],
  props: {
    showitems: { type: Boolean, default: true, description: 'Прячем или нет элементы списка' },
    /**
     * строка или функция, возвращающая css-класс для для
     */
    listclass: { type: String, description: 'Строка, содержащая название класса для элемента ul внутри cd-list' },
    /**
     * строка или функция, возвращающая css-класс для строки коллекции
     */
    rowclass: { type: [String, Function], default: '', description: 'Строка или функция, возвращающая строку с классом для элемента списка, ' },
    listitemclicked: { type: Function, default: function (event, scope) {}, description: 'Функция, которая выполнится по клику на элементе списка' },
    listitementered: { type: Function, default: function (event, scope) {}, description: 'Функция, которая выполнится при входе мыши на элемент списка' },
    listitemleaved: { type: Function, default: function (event, scope) {}, description: 'Функция, которая выполнится при выходе из элемента списка' },
    listleave: { type: Function, default: function (event) {}, description: 'Функция, которая выполнится при выходе мыши из списка' },
    listenter: { type: Function, default: function (event) {}, description: 'Функция, которая выполнится при входе мыши в список' }
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
