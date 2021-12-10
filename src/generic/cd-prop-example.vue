<template>
  <div class="cd-prop-example--content">
    <cd-form class="cd-descriptor--editor" :payload="property" :descriptor="options"></cd-form>
    <div class="cd-descriptor--view">
      <code>
        <div>{{ property }}</div>
      </code>
    </div>
    <cd-form class="cd-example--form" :payload="payload" :descriptor="convertproperty(property)"></cd-form>
  </div>
</template>

<script>
import CDForm from '@/components/cd-form.vue'

export default {
  name: 'cd-prop-example',
  components: {
    'cd-form': CDForm
  },
  props: {
    property: { type: Object, reqiuired: true },
    options: { type: Array, required: true },
    convertproperty: { type: Function },
    payload: { type: Object, required: true }
  },
  data (example) {
    return {
    }
  }
}
</script>

<style>
  .cd-prop-example--content {
    display: flex;
  }
  .cd-descriptor--editor {
    width: 30%
  }
  .cd-descriptor--view {
    width: 30%;
    white-space: pre-wrap;
  }
  .cd-example--form {
    width: 30%;
  }
  .prop-example--header {
    font-size: 3em;
    text-align: center;
}
</style>
