<template>
  <cd-list class="d-flex cd-tabs" :class="{ 'flex-column': isCol, 'flex-column': isRow}" :collection="tabs" :keyfield="tabKey"
    :listclass="['cd-tabs--wrap list-unstyled nav nav-tabs border-0 px-0', tabListClass,
      {
        'flex-column': isCol,
        'flex-row' :isRow,
        'ps-0': inRight,
        'pe-0': inLeft,
      }]" :rowclass="tabClassResolved" listrole="tablist" itemrole="tab">
    <template v-if="isHeaderContent" slot="header">
      <div class="cd-tabs--content tab-content border" :class="[{ 'flex-column': isCol, 'flex-row': isRow }, tabClass, innerClass.content]">
        <slot name="content"></slot>
      </div>
    </template>
    <div class="sring-start" :class="{
      'border-end': inLeft,
      'border-start': inRight,
      'border-bottom': inHeader,
      'border-top': inFooter
    }" slot="pre">
      <div :class="{ 'w-1': isRow, 'h-1': isCol }"/>
    </div>
    <div class="cd-tab border-0 mb-0" data-toggle="tab" slot-scope="{ row, index }">
      <div class="cd-tab--header border rounded-0"
        :class="[row.class, innerClass.rounded, isActive(row) ? ['active', innerClass.activeBorder] : innerClass.border]">
        <slot :tab="row" :index="index">
          <span class="cd-tab--header-default">{{ resolveTabCaption(row) }}</span>
        </slot>
      </div>
    </div>
    <div class="spring-end d-flex p-2" slot="post" :class="{
      'flex-grow-1': isRow,
      'border-end': inLeft,
      'border-start': inRight,
      'border-bottom': inHeader,
      'border-top': inFooter
    }">
      <div :class="{ 'w-1': isRow, 'h-1': isCol }"/>
    </div>
    <template v-if="isFooterContent" slot="footer">
      <div class="cd-tabs--content tab-content border px-2" :class="[{ 'col': isCol }, innerClass.content]">
        <slot name="content"></slot>
      </div>
    </template>
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
    tabListClass: { type: [String, Object, Array], description: 'CSS классы для списка вкладок' },
    tabClass: { type: [String, Object, Array, Function], default: 'cd-tab' },
    tabs: { type: Array, required: true, description: 'Вкладки' },
    tabCaption: { type: [Function, String], description: 'Свойство объекта [tab] из массива [tabs], в котором находится заголовок вкладки, или же функция, которая для объекта вкладки возвращает её заголовок' },
    tabKey: { type: String, required: true, default: 'key', description: 'Свойство объекта из массива [tabs], в котором находится идентификатор вкладки' },
    isTabDisabled: { type: Function, description: 'Вычисляем для объекта вкладки и её индекса в массиве [tabs], будет ли вкладка задисаблена' },
    onTabSelect: { type: Function, description: 'Что произойдёт при клике на вкладку' },
    orientation: {
      type: String,
      default: 'row-top',
      validator: function (value) {
        return ['row-top', 'row-bottom', 'col-left', 'col-right'].indexOf(value) >= 0
      },
      description: 'Расположение списка вкладок'
    }
  },
  computed: {
    tabClassResolved ({ tabClass, isRow }) {
      if (typeof tabClass == 'function') {
        return (tab) => (['cd-tab--wrap nav-item', { 'd-flex': isRow }, tabClass(tab)])
      } else {
        return ['cd-tab--wrap nav-item', { 'd-flex': isRow }, tabClass]
      }
    },
    resolveTabCaption ({ tabCaption }) {
      return (tab, index) => tabCaption === undefined
        ? tab
        : (typeof tabCaption === 'function' ? tabCaption(tab, index) : tab[tabCaption])
    },
    innerClass ({ inLeft, inRight, inHeader, inFooter }) {
      return {
        content: {
          'border-start-0': inLeft,
          'border-top-0': inHeader,
          'border-bottom-0': inFooter,
          'w-100 border-end-0': inRight
        },
        rounded: {
          'rounded-start': inLeft,
          'rounded-end': inRight,
          'rounded-bottom': inFooter,
          'rounded-top': inHeader
        },
        border: {
          'border-top': inFooter,
          'border-end': inLeft,
          'border-start': inRight,
          'border-bottom': inHeader
        },
        activeBorder: {
          'border-top-0': inFooter,
          'border-end-0': inLeft,
          'border-start-0': inRight,
          'border-bottom-0': inHeader,
          'fw-bold': true
        }
      }
    },
    resolveTabDisabled () {
      const isTabDisabled = this.isTabDisabled
      const isFunction = typeof isTabDisabled === 'function'
      return (row, index) => isTabDisabled === undefined
        ? false
        : isFunction
          ? isTabDisabled(row, index)
          : isTabDisabled
    },
    isActive ({ $route, tabKey }) {
      return (row) => {
        return $route.hash === `#${row[tabKey]}`
      }
    },
    inHeader ({ orientation }) {
      return ['row-top'].indexOf(orientation) >= 0
    },
    inFooter ({ orientation }) {
      return ['row-bottom'].indexOf(orientation) >= 0
    },
    isActiveInFooter ({ isActive, inFooter }) {
      return (row) => isActive(row) && inFooter
    },
    isRow ({ orientation }) {
      return ['row-bottom', 'row-top'].indexOf(orientation) >= 0
    },
    isCol ({ orientation }) {
      return ['col-left', 'col-right'].indexOf(orientation) >= 0
    },
    inLeft ({ orientation }) {
      return ['col-left'].indexOf(orientation) >= 0
    },
    inRight ({ orientation }) {
      return ['col-right'].indexOf(orientation) >= 0
    },
    isHeaderContent ({ inFooter, inRight }) {
      return inFooter || inRight
    },
    isFooterContent ({ inHeader, inLeft }) {
      return inHeader || inLeft
    }
  }
}
</script>

<style>
  .cd-tab--wrap {
    max-width: min-content;
  }

  .width-maxc {
    min-width: max-content;
  }
  .h-1 {
    height: 1vh;
  }
  .w-1 {
    width: 1vw;
  }
</style>
