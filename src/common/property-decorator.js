export default {
  name: 'property-descriptor',
  props: {
    descriptor: {
      type: Array,
      default (payload) {
        return []
      },
      description: 'Массив объектов-дескрипторов свойств, с которыми будет иметь дело декоратору'
    },
    isvisible: {
      type: Function,
      default (property) {
        return true
      },
      returns: Boolean,
      description: 'Функция, которая определяет, видим ли мы колонку в таблице или поле на форме'
    },
    iseditable: {
      type: Function,
      default (property) {
        return true
      },
      returns: Boolean,
      description: 'Функция, которая определяет, можем ли мы редактировать значение в колонке или в элементе формы'
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
