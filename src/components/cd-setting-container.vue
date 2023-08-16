<template>
  <div class="cd-setting-container">
    <div class="show-hide-setting">
      <div class="button-container">
        <i class="bi bi-gear-wide-connected" v-on:click="onsettingtoogle"></i>
        <div v-if="showform" class="setting-form--container bg-white opacity-100">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="config-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cd-setting-container',
  data (container) {
    return {
      showform: false
    }
  },
  methods: {
    onsettingtoogle (event) {
      this.showform = !this.showform
    }
  }
}
</script>

<style>
  .button-container {
    display: block;
    height: auto;
    padding:3px;
    margin-right: 10px;
  }
  .button-container > i {
    padding: 5px;
  }
  .setting-form--container {
    position: absolute;
    z-index: 11;
    width: 300px;
    background-color: white;
    border-top: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
    border-bottom: 1px solid;
    box-shadow: 0px 5px 5px -2px rgb(34 60 80 / 60%);
  }
  .config-content {
  }
</style>
