export default {
  props: {
    payload: { type: Object },
    get: { type: Object }
  },
  watch: {
    // payload: {
    //   deep: true,
    //   handler (newvalue, oldvalue) {
    //     const parent = this
    //     if (newvalue) {
    //       parent.loaddata(parent.get.url, newvalue)
    //     }
    //   }
    // }
  }
}
