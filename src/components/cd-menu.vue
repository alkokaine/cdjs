<template>
  <!-- основой для меню является cd-list -->
  <cd-list :listclass="listclass" class="cd-menu--list"
    :keyfield="itemkey" :inner="inner" :showitems="showitems"
    :collection="menu" :rowclass="resolverowclass">
    <!-- слот заголовка списка обзовём слотом заголовка меню -->
    <div slot="header" class="cd-menu--header">
      <slot name="menu-header"></slot>
    </div>
    <!-- для каждого элемента списка нарисуем такое -->
    <cd-menu-item slot-scope="scope" :inner="inner"
      :iscollapsed="iscollapsed" :isactive="scope.index === selected"
      :onclick="onmenuclicked(scope)" :class="[{ 'is-active': scope.index === selected, 'inner': inner }]">
      <i slot="icon" :class="scope.row[icon]"/>
      <span slot="text">{{ scope.row[text] }}</span>
      <cd-menu v-if="scope.row[property] && scope.index == selected" class="cd-menu--inner"
        :name="scope.row[itemkey]" :inner="true" :iscollapsed="iscollapsed" :menu="scope.row[property]"
        :itemkey="itemkey" :icon="icon" :property="property" :text="text"/>
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
    },
    onmenuclicked () {
      const menu = this
      return (scope) => (event) => {
        console.log(event)
        if (menu.selected === scope.index) {
          menu.selected = -1
        } else {
          menu.selected = scope.index
        }
        if (scope.row.url && scope.row.url !== menu.$route.path && (event.sender === 'text' || !menu.iscollapsed)) menu.$router.push(scope.row.url)
      }
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
    background-color: #006195;
  }
  .cd-menu--item.is-active {
    background-color: #07305c;
  }
</style>
