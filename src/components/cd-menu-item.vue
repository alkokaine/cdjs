<template>
  <div class="cd-menu-item">
    <div class="cd-menu-a border-top" :class="[{ 'is-collapsed': iscollapsed, 'is-hover': ishover }]" v-on:click.stop="onclick($event, item)">
      <div class="cd-menu--icon pb-2 pt-2 w-auto" :class="{ 'm-auto': iscollapsed && !inner, 'ps-1': !iscollapsed }"><i :class="[item.row.icon]"/></div>
      <div v-if="inner || !iscollapsed || (ishover || isactive)" class="cd-menu--text pb-2 pt-2" :class="{ 'show-up': !inner && iscollapsed && (ishover || isactive) }">
        <div class="ps-2" :class="[{ 'is-collapsed': iscollapsed }, $vnode.data.class]">{{ item.row.text }}</div>
      </div>
    </div>
    <div v-if="$slots.default" class="sub-items" :class="{ 'show-up': iscollapsed && (ishover || isactive), 'inner': inner, 'border-start border-1': !inner && iscollapsed }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cd-menu-item',
  props: {
    isactive: { type: Boolean, default: false },
    onclick: { type: Function },
    iscollapsed: { type: Boolean },
    item: { type: Object },
    inner: { type: Boolean, default: false }
  },
  data (mi) {
    return {
      ishover: false
    }
  },
  methods: {
    changehover (event) {
      this.ishover = !this.ishover
    }
  }
}
</script>

<style>
  .cd-menu-a {
    text-decoration: none!important;
    color: white!important;
    display: flex;
  }
  .cd-menu--item {
    cursor: pointer;
  }
  .cd-menu--item.is-active {
  }
  .cd-menu--icon {

  }
  .cd-menu--text.show-up {
    background-color: #101010;
  }

  .sub-items.show-up, .cd-menu--text.show-up {
    overflow: visible!important;
    position: absolute;
    left: 100%;
    width:200px;
    top: inherit;
  }
  .sub-items.show-up.inner {
    left: unset;
  }
  .inner.inner {
    position: relative;
  }
</style>
