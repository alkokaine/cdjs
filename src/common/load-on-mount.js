export default {
  props: {
    payload: { type: Object },
    get: { type: Object }
  },
  mounted () {
    if (this.get) this.loaddata(this.get.url, this.payload)
  }
}
