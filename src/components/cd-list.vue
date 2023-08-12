<template>
  <div class="cd-list">
    <slot name="header"></slot>
    <ul v-loading="isloading" :role="listrole" class="cd-list--wrap" :class="[listclass, { 'inner': inner, 'd-none': !showitems }]">
      <li v-if="isempty" class="cd-list--item no-data">
        <slot name="no-data"></slot>
      </li>
      <li v-for="(row, index) in filtered"
        :key="rowkey(row)" class="cd-list--item" :class="rowClassResolved(row, index)"
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
