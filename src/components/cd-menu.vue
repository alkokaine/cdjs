<template>
  <!-- основой для меню является cd-list -->
  <cd-list :listclass="listclass" class="cd-menu--list"
    :onlistleave="onmenuleave"
    :listitementered="onmenuitementer"
    :listitemclicked="onmenuclicked"
    :listleave="onmenuleave"
    :showitems="showitems"
    :keyfield="itemkey" :inner="inner"
    :class="{ 'inner': inner,'is-collapsed': iscollapsed }"
    :collection="menu">
    <!-- слот заголовка списка обзовём слотом заголовка меню -->
    <div slot="header" class="cd-menu--header">
      <slot name="menu-header"></slot>
    </div>
    <!-- для каждого элемента списка нарисуем такое -->
    <div slot-scope="scope" class="cd-menu-item--block"
      :class="{ 'is-collapsed': iscollapsed, 'is-active': isselected(scope), 'inner': inner, 'reversed': scope.row.is_drop }">
      <!-- блок заголовка: -->
      <div class="cd-menu-item--header" :class="{'is-collapsed': iscollapsed, 'is-active': isselected(scope) }">
        <!-- пиктограмма, взятая из свойства icon объекта scope.row  -->
        <i class="cd-menu-item--icon" :class="scope.row[icon]"></i>
        <!--  и, если менюшка не коллапсед, текст из свойства text объекта scope.row -->
        <span v-if="!iscollapsed || isactive" class="cd-menu-item--text" :class="{ 'is-collapsed': iscollapsed }">{{ scope.row[text] }}</span>
      </div>
      <!--  если у менюшки в свойстве property есть дочернее меню, нарисуем его -->
      <cd-menu class="cd-menu--children" :class="{ 'is-collapsed': iscollapsed, 'is-active': isselected(scope) }"
        :inner="true" :menu="scope.row[property]" :itemkey="itemkey" :icon="icon" :property="property" :text="text"
        :showitems="isselected(scope)" :isactive="isselected(scope)" :menuitemclicked="menuitemclicked">
        <!--  а если менюшка коллапсед, текст пойдёт в заголовок дочерней менюшки-->
        <div v-if="iscollapsed && isselected(scope)" class="cd-menu-children--header is-collapsed" slot="menu-header">
          <span class="cd-menu-item--text">{{ scope.row[text] }}</span>
        </div>
      </cd-menu>
    </div>
    <div slot="footer">
      <slot name="menu-footer"></slot>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'

export default {
  name: 'cd-menu',
  components: {
    'cd-list': CDList
  },
  props: {
    showitems: { type: Boolean, default: true },
    onclearselected: { type: Function, default: function () {} },
    menuitemclicked: {
      type: Function,
      default: function (event, row) {
        console.log(row)
      }
    },
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
      selected: -1
    }
  },
  watch: {
    selected: {
      handler (nvalue) {
        if (nvalue === -1) this.onclearselected()
      }
    },
    showitems: {
      /**
       * при изменении showitems на false сбрасываем выбранный элемент меню
       */
      handler (nvalue) {
        if (!nvalue) this.selected = -1
      }
    },
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
      return (scope) => scope.row[menu.itemkey] === menu.selected
    },
    listclass () {
      return this.iscollapsed ? 'cd-menu--items is-collapsed' : 'cd-menu--items'
    }
  },
  methods: {
    onmenuclicked (event, scope) {
      const menu = this
      // если ключ нового кликнутого пункта меню равен уже выбранному или не содержит дочернего меню
      // сбросим выбранный ключ
      if (menu.selected === scope.row[menu.itemkey] || !scope.row[menu.property]) {
        menu.selected = -1
        // если элемент, по которому кликнули, содержит свойство, переданное в this.property
      } else if (scope.row[menu.property]) {
        menu.selected = scope.row[menu.itemkey]
      }
      // отдадим выполнение дальше
      menu.menuitemclicked(event, scope)
    },
    onmenuitementer (event, scope) {
      if (this.iscollapsed) {
        this.selected = scope.row[this.itemkey]
      }
    },
    onmenuleave (event) {
      if (this.iscollapsed) this.selected = -1
    }
  }
}
</script>

<style>
  .cd-menu--list > ul {
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
  }
</style>
