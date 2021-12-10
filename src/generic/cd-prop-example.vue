<template>
  <div class="cd-prop-example--content">
    <div class="cd-descriptor--editor">
      <cd-form class="cd-property-editor" :payload="property" :descriptor="options"></cd-form>
      <cd-form class="cd-params-editor" :payload="propertypayload" :descriptor="paramsdescriptor"></cd-form>
    </div>
    <div class="cd-descriptor--view">
      <code>
        <div>{{ property }}</div>
        <div>{{ propertypayload }}</div>
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
    paramsdescriptor: { type: Array, required: true },
    convertproperty: { type: Function },
    payload: { type: Object, required: true }
  },
  data (example) {
    return {
    }
  },
  computed: {
    propertypayload () {
      const property = this.property
      if (property) return this.property.resolvepayload(this.payload)
      return false
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
