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
      returns: Boolean,
      description: 'Вычисляет, выбран указанный row, или нет'
    },
    cbkey: {
      type: Function,
      default: function (row, index) {
        const selection = this
        return `cb_${row[selection.keyfield]}_${index}`
      },
      returns: String,
      description: 'Возвращает вычисленный id для элемента выбора объекта коллекции'
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
            const unselected = selection.collection.filter(row => !selection.isrowselected(row))
            unselected.forEach(u => selection.selectedrows.push(u[selection.keyfield]))
          }
        }
      },
      description: 'Функция будет выполняться при выборе строки'
    },
    selectedrowindex: {
      type: Function,
      default: function (row) {
        const selection = this
        return (selection.selectedrows.findIndex((r) => r === row[selection.keyfield]))
      },
      description: '(тут была какая-то идея)'
    },
    keyfield: { type: String, required: true, description: 'Свойство-идентификатор объекта коллекции' }
  },
  data () {
    return {
      selectedrows: [],
      allselected: false
    }
  },
  watch: {
    'selectedrows.length': {
      handler (newvalue, oldvalue) {
        if (oldvalue === this.collection.length && newvalue < this.collection.length) this.allselected = false
        if (newvalue === this.collection.length && oldvalue < this.collection.length) this.allselected = true
      }
    }
  }
}
