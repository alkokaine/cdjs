export default {
  name: 'property-descriptor',
  props: {
    descriptor: {
      type: Array,
      default (payload) {
        console.log(payload)
        return []
      }
    },
    isvisible: {
      type: Function,
      default (property) {
        console.log(Object.prototype.hasOwnProperty.call(property, 'hidden'))
        return true
      },
      returns: Boolean
    },
    iseditable: {
      type: Function,
      default (property) {
        console.log(Object.prototype.hasOwnProperty.call(property, 'canedit'))
        return true
      },
      returns: Boolean
    }
  },
  data () {
    return {

    }
  },

  computed: {
    visibleproperties () {
      return this.descriptor.filter((property) => this.isvisible(property))
    },
    propertykey () {
      return (property, index) => (property.datafield || `prop_${index}`)
    },
    isdescriptor () {
      return (property) => Object.prototype.hasOwnProperty.call(property, 'descriptor')
    },
    haslegend () {
      return (property) => Object.prototype.hasOwnProperty.call(property, 'text')
    }
  }

}
