export default {
  props: {
    get: { type: Object, default: () => ({}) }
  },
  watch: {
    'get.url': {
      handler (newvalue, oldvalue) {
        const parent = this
        if (newvalue) {
          parent.loaddata(newvalue, parent.payload)
        }
      }
    }
  }
}
