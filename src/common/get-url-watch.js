export default {
  props: {
    get: { type: Object, default: () => ({}) }
  },
  watch: {
    'get.url': {
      immediate: true,
      handler (newvalue, oldvalue) {
        const parent = this
        if (newvalue) {
          parent.loaddata(newvalue, parent.payload)
        }
      }
    }
  }
}
