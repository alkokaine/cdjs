<template>
  <div class="">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="target">Click me!</button>
    <div class="cd-modal modal fade" :id="idmodal" :aria-labelledby="modallabel" aria-hidden="true">
      <div class="modal-dialog" :class="[{ 'modal-dialog-centered': iscentered }]">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title" :id="modallabel">
              <slot name="title"></slot>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Send message</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cd-modal',
  props: {
    idmodal: { type: String, required: true },
    iscentered: { type: Boolean, default: true }
  },
  data (modal) {
    return {
      modallabel: `aria-label-${modal.idmodal}`,
      target: `#${modal.idmodal}`
    }
  }
}
</script>

<style>
</style>
