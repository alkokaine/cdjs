<template>
  <!-- основой для меню является cd-list -->
  <cd-list :listclass="listclass" class="cd-menu--list"
    :keyfield="itemkey" :inner="inner"
    :showitems="showitems"
    :collection="menu"
    :rowclass="resolverowclass">
    <!-- слот заголовка списка обзовём слотом заголовка меню -->
    <div slot="header" class="cd-menu--header">
      <slot name="menu-header"></slot>
    </div>
    <!-- для каждого элемента списка нарисуем такое -->
    <cd-menu-item slot-scope="scope"
      :item="scope"
      :inner="inner"
      :iscollapsed="iscollapsed"
      :isactive="scope.index === selected"
      :onclick="onmenuclicked"
      :class="[{ 'is-active': scope.index === selected, 'inner': inner }]">
      <cd-menu v-if="scope.row[property] && scope.index == selected" class="cd-menu--inner" :name="scope.row[itemkey]" :inner="true" :iscollapsed="iscollapsed" :menu="scope.row[property]" :itemkey="itemkey" :icon="icon" :property="property" :text="text">
      </cd-menu>
    </cd-menu-item>
    <div slot="footer">
      <slot name="menu-footer"></slot>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
import CDMenuItem from './cd-menu-item.vue'
export default {
  name: 'cd-menu',
  components: {
    'cd-list': CDList,
    'cd-menu-item': CDMenuItem
  },
  props: {
    showitems: { type: Boolean, default: true },
    /**
     * признак свёрнутости
     */
    iscollapsed: { type: Boolean, default: false },
    /**
     *  признак дочернего меню
     */
    inner: { type: Boolean, default: false },
    /**
     * свойство, в котором находится дочернее меню элемента
     */
    property: { type: String, default: 'menu' },
    /**
     * свойство, в котором находится пиктограмма менюшки
     */
    icon: { type: String, default: 'icon' },
    /**
     * имя свойства, в котором находится условный первичный ключ
     */
    itemkey: { type: String, default: 'id' },
    /**
     * имя свойства, в котором находится текст пункта меню
     */
    text: { type: String, default: 'text' },
    /**
     * коллекция элементов меню
     */
    menu: { type: Array, required: true, default: () => ([]) },
    /**
     * признак того, что элемент меню, содержащий дочернее меню, переданное в свойство menu
     * в том или ином виде выбран
    */
    isactive: { type: Boolean, default: false },
    /**
     * расположение элементов меню
    */
    vertical: { type: Boolean, default: true }
  },
  data (docmenu) {
    return {
      selected: -1,
      listclass: ['list-unstyled cd-menu--items', { 'is-collapsed': docmenu.iscollapsed, inner: docmenu.inner }]
    }
  },
  watch: {
    /**
     * при изменении свойства iscollapsed сбрасываем выбранный элемент меню
     */
    iscollapsed: {
      handler (nvalue) {
        this.selected = -1
      }
    }
  },
  computed: {
    /**
     * возврашает true для элемента, ключ которого равен значению menu.selected
     */
    isselected () {
      const menu = this
      return (scope) => scope.index === menu.selected
    },
    resolverowclass () {
      const menu = this
      return (scope, index) => {
        if (index === menu.selected) return 'cd-menu--item is-active'
        else return 'cd-menu--item'
      }
    }
  },
  methods: {
    onmenuclicked (event, scope) {
      const menu = this
      if (menu.selected === scope.index) {
        menu.selected = -1
      } else {
        menu.selected = scope.index
      }
      if (scope.row.url) menu.$router.push(scope.row.url)
    }
  }
}
</script>

<style>
  .cd-menu--list {
    color: white;
    padding-inline-start: 0;
    background-color: var(--menu-background);
  }
  .cd-menu--inner {
  }
  /* .cd-menu--list > ul {
    display: block;
    list-style-type: none;
    padding-inline-start: 0;
  }
  .cd-menu--children {
    background-color: var(--menu-background);
  }
  .cd-menu--children.is-collapsed {
    position: absolute;
    left: 100%;
    overflow: visible!important;
    background-color: var(--menu-background);
  }
  .cd-menu-item--block {
    transition-property: background-color, color;
    transition-duration: 1s;
    transition-timing-function: ease-out;
  }
  .cd-menu-item--block:hover {
    transition-property: background-color, color;
    transition-duration: 1s;
    transition-timing-function: ease-out;
    background-color: rgb(130, 166, 233);
  }
  .cd-menu-item--block.is-active {
    background-color: rgb(130, 166, 233);
  }
  .cd-menu-item--icon, .cd-menu-item--text {
    line-height: var(--menu-item-height);
  }
  .cd-menu-item--text {
    padding-left: var(--menu-padding);
  }
  .cd-menu-item--icon {
    min-height: var(--icon-height);
    min-width: var(--icon-width);
    line-height: var(--menu-item-height);
    padding: var(--icon-padding);
  }
  .cd-menu--children.is-collapsed.is-active {
    display: flex;
    width: var(--menu-width);
    flex-direction: column;
  }
  .cd-menu--list {
    width: inherit;
  }
  .cd-menu-children--header {
    background-color: black;
    cursor: pointer;
  }
  .cd-menu-item--block.is-collapsed.is-active {
    display: flex;
  }
  .cd-menu-item--header {
    cursor: pointer;
  }
  .cd-menu-item--block.reversed {
    display: flex;
    flex-direction: column-reverse;
  } */
</style>
