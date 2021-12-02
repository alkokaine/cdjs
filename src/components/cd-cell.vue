<template>
  <div class="cd-cell">
      <label v-if="showlabel" :for="config.datafield" class="cd-cell--label">{{ config.text }}</label>
      <template v-if="config.select">
        <select :multiple="config.select.multiple" :name="config.datafield"
          :required="config.required">
          <option v-for="(option) in config.select.options()" :key="option[config.select.valuekey]"
            :disabled="config.select.isdisabled(option)" :label="option[config.select.labelkey]"
            :value="option[config.select.valuekey]"></option>
        </select>
      </template>
      <template v-else-if="config.input">
        <input :type="config.input.type" :name="config.datafield" :readonly="config.readonly"
          :value="value" :required="config.required" :pattern="config.input.pattern"
          :class="{'is-readonly': config.readonly}" :placeholder="config.input.placeholder"
          :min="config.input.min" :max="config.input.max" :minlength="config.input.minlength"
          :maxlength="config.input.maxlength"
          :checked="config.input.checked"/>
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
  data (cell) {
    return {
      options: cell.config.options ? cell.config.options() : null
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
