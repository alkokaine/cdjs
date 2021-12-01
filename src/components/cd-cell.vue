<template>
  <div class="cd-cell">
      <label v-if="showlabel" :for="config.datafield" class="cd-cell--label">{{ config.text }}</label>
      <template v-if="config.input">
        <input :id="config.datafield" :readonly="config.readonly" :value="value" :class="{ 'is-readonly' :config.readonly }"/>
      </template>
  </div>
</template>

<script>
export default {
  name: 'cd-cell',
  props: {
    config: { type: Object, required: true },
    showlabel: { type: Boolean, default: false }
  },
  computed: {
    value () {
      return this.config.value()
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style>
  input.is-readonly {
    border-style: none;
    cursor: default;
  }
</style>
