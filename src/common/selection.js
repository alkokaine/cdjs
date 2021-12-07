export default {
  name: 'selection',
  props: {
    isrowselected: {
      type: Function,
      default: function (row) {
        const selection = this
        if (selection.selectedrows.length === 0) return false
        return selection.selectedrowindex(row) >= 0
      },
      returns: Boolean
    },
    cbkey: {
      type: Function,
      default: function (row, index) {
        const selection = this
        return `cb_${row[selection.keyfield]}_${index}`
      },
      returns: String
    },
    onrowselect: {
      type: Function,
      default: function (event, row) {
        const selection = this
        if (row !== undefined) {
          const index = selection.selectedrowindex(row)
          if (index < 0) selection.selectedrows.push(row[selection.keyfield])
          else selection.selectedrows.splice(index, 1)
        } else {
          if (this.allselected) {
            selection.selectedrows = []
          } else {
            const unselected = selection.list.filter(row => !selection.isrowselected(row))
            unselected.forEach(u => selection.selectedrows.push(u[selection.keyfield]))
          }
        }
      }
    },
    selectedrowindex: {
      type: Function,
      default: function (row) {
        const selection = this
        return (selection.selectedrows.findIndex((r) => r === row[selection.keyfield]))
      }
    },
    keyfield: { type: String, required: true },
    selectrows: { type: Boolean, default: false }
  },
  data () {
    return {
      selectedrows: []
    }
  },
  computed: {
    allselected () {
      return this.selectedrows.length === this.list.length
    }
  }
}
