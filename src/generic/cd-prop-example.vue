<template>
  <div class="cd-prop-example--content">
    <div class="cd-descriptor--editor">
      <slot name="editor" />
    </div>
    <div class="cd-descriptor--view">
      <code>
        <slot name="preview" />
      </code>
    </div>
    <div class="cd-example--form">
      <slot name="sandbox" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'CdPropExample'
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
