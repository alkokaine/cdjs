<template>
  <div class="cd-list">
    <slot name="header"></slot>
    <ul v-loading="isloading" class="cd-list--wrap" :class="[listclass, { 'inner': inner }]" :role="listRole">
      <li v-if="isempty" class="cd-list--item no-data">
        <slot name="no-data"></slot>
      </li>
      <template v-if="showitems">
        <li v-for="(row, index) in filtered" :key="rowkey(row, index)" class="cd-list--item" :class="rowclassResolved(row, index)" :role="itemRole"
          @click="handleitemevent({ $event, row, index }, onLiClick)"
          @mousedown="handleitemevent({ $event, row, index }, onLiMouseDown)"
          @mouseenter="handleitemevent({ $event, row, index }, onLiMouseEnter)"
          @mouseleave="handleitemevent({ $event, row, index }, onLiMouseLeave)"
          @mousemove="handleitemevent({ $event, row, index }, onLiMouseMove)"
          @mouseout="handleitemevent({ $event, row, index }, onLiMouseOut)"
          @mouseover="handleitemevent({ $event, row, index }, onLiMouseOver)"
          @mouseup="handleitemevent({ $event, row, index }, onLiMouseUp)"
          @mousewheel="handleitemevent({ $event, row, index }, onLiMouseWheel)">
          <slot :row="row" :index="index"></slot>
        </li>
      </template>
      <li v-if="$slots.placeholder" class="cd-list--item cd-list--placeholder" role="presentation">
        <slot name="placeholder"></slot>
      </li>
    </ul>
    <slot name="footer"></slot>
  </div>
</template>

<script>

import collection from '../common/collection'
import utils from '../common/utils'

export default {
  name: 'cd-list',
  mixins: [collection],
  props: {
    isrowvisible: { type: Function },
    showitems: { type: Boolean, default: true, description: 'Прячем или нет элементы списка' },
    /**
     * строка или функция, возвращающая css-класс для для
     */
    listclass: { type: [String, Array], description: 'Строка или массив, содержащие названия классов, которые будут применены к ul внутри cd-list' },
    /**
     * строка или функция, возвращающая css-класс для строки коллекции
     */
    rowclass: { type: [String, Array, Function], default: '', description: 'Строка или функция, возвращающая строку с классом для элемента списка, ' },
    onLiClick: { type: Function, description: 'Функция-обработчик события onclick' },
    onLiMouseDown: { type: Function, description: 'Функция-обработчик события onmousedown' },
    onLiMouseEnter: { type: Function, description: 'Функция-обработчик события onmouseenter' },
    onLiMouseLeave: { type: Function, description: 'Функция-обработчик события onmouseleave' },
    onLiMouseMove: { type: Function, description: 'Функция-обработчик события onmousemove' },
    onLiMouseOut: { type: Function, description: 'Функция-обработчик события onmouseout' },
    onLiMouseOver: { type: Function, description: 'Функция-обработчик события onmouseover' },
    onLiMouseUp: { type: Function, description: 'Функция-обработчик события onmouseup' },
    onLiMouseWheel: { type: Function, description: 'Функция-обработчик события onmousewheel' },
    itemRole: {
      type: String,
      validator: function (value) {
        if (utils.ListItemAriaRole.indexOf(value) === -1) {
          console.error('[CDJS:PropertyError] invalid property value, expected:', utils.ListAriaRole)
          return false
        }
        return true
      },
      default: 'presentation',
      description: 'Волшебная aria-role элемента списка'
    },
    listRole: {
      type: String,
      default: 'presentation',
      description: 'aria-role списка',
      validator: function (value) {
        if (utils.ListAriaRole.indexOf(value) === -1) {
          console.error('[CDJS:PropertyError] invalid property value, expected:', utils.ListItemAriaRole)
          return false
        }
        return true
      }
    },
    /**
     * свойство-признак того, что эта коллекция вложена в другую
     */
    inner: { type: Boolean, default: false, description: 'Признак того, что коллекция вложенная' }
  },
  watch: {
    payload: {
      handler (newvalue, oldvalue) {
        if (newvalue !== undefined) this.loaddata(this.get.url, newvalue)
      }
    }
  },
  methods: {
    handleitemevent ({ $event, row, index }, callback) {
      if (callback) {
        callback($event, { row, index })
      }
    }
  },
  // watch: {
  //   get: {
  //     deep: true,
  //     immediate: true,
  //     handler (newvalue, oldvalue) {
  //       if (newvalue !== undefined && newvalue !== oldvalue) this.loaddata(newvalue.url, this.payload)
  //     }
  //   }
  // },
  computed: {
    isempty () {
      return this.filtered.length === 0
    },
    filtered () {
      const list = this
      if (list.isrowvisible === undefined) return list.collection
      return list.collection.filter(row => list.isrowvisible(row))
    },
    rowclassResolved () {
      const list = this
      return (row, index) => {
        if (typeof list.rowclass === 'string' || Array.isArray(list.rowclass)) return list.rowclass
        return list.rowclass(row, index)
      }
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
