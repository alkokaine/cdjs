<template>
  <div class="cd-list" v-on:mouseleave="listleave">
    <slot name="header"></slot>
    <ul v-if="showitems" v-loading="isloading" :role="listrole" class="cd-list--wrap" :class="[listclass, { 'inner': inner }]">
      <li v-if="isempty" class="cd-list--item no-data">
        <slot name="no-data"></slot>
      </li>
      <li v-for="(row, index) in filtered"
        :key="rowkey(row)" class="cd-list--item" :class="rowClassResolved(row, index)"
        v-on:click="listitemclicked($event, { row, index })"
        v-on:mouseenter="listitementered($event, { row, index })"
        role="presentation">
        <slot :row="row" :index="index"></slot>
      </li>
      <li v-if="$slots.placeholder" class="cd-list--item cd-list--placeholder" role="presentation">
        <slot name="placeholder"></slot>
      </li>
    </ul>
    <slot name="footer"></slot>
  </div>
</template>

<script>

import collection from '../common/collection'
import selection from '../common/selection'
import watchurl from '../common/get-url-watch'
export default {
  name: 'cd-list',
  mixins: [collection, selection, watchurl],
  props: {
    isrowvisible: { type: Function },
    showitems: { type: Boolean, default: true, description: 'Прячем или нет элементы списка' },
    /**
     * строка или функция, возвращающая css-класс для для
     */
    listclass: { type: [String, Array], description: 'Строка или массив, содержащие названия классов, которые будут применены к ul внутри cd-list' },
    listitemclicked: { type: Function, default: function (event, scope) {}, description: 'Функция, которая выполнится по клику на элементе списка' },
    listitementered: { type: Function, default: function (event, scope) {}, description: 'Функция, которая выполнится при входе мыши на элемент списка' },
    listitemleaved: { type: Function, default: function (event, scope) {}, description: 'Функция, которая выполнится при выходе из элемента списка' },
    listleave: { type: Function, default: function (event) {}, description: 'Функция, которая выполнится при выходе мыши из списка' },
    listenter: { type: Function, default: function (event) {}, description: 'Функция, которая выполнится при входе мыши в список' },
    /**
     * свойство-признак того, что эта коллекция вложена в другую
     */
    inner: { type: Boolean, default: false, description: 'Признак того, что коллекция вложенная' },
    listrole: { type: String }
  },
  computed: {
    isempty ({ filtered }) {
      return filtered.length === 0
    },
    filtered ({ isrowvisible, collection }) {
      if (isrowvisible === undefined) return collection
      return collection.filter(row => isrowvisible(row))
    }
  }
}
</script>

<style>
  .cd-list--wrap {
    background-color: inherit;
  }
  li.no-data {
    list-style: none;
  }
</style>
