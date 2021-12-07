<template>
  <div>
    <h3>{{ component.name }}</h3>
    <cd-grid keyfield="propertyname" :collection="data" :descriptor="descriptor" :allownew="false"></cd-grid>
  </div>
</template>

<script>
import CDGrid from '../components/cd-grid.vue'
import utils from '../common/utils'
export default {
  components: {
    'cd-grid': CDGrid
  },
  props: {
    component: { type: Object, required: true },
    property: { type: String, required: true }
  },
  data (info) {
    return {
      data: Array.from(Object.keys(info.component[info.property])).map(pname => info.mapcomponentproperty(pname, info.component)),
      descriptor: [
        {
          datafield: 'propertyname',
          text: 'Свойство'
        },
        {
          datafield: 'type',
          text: 'Принимаемое значение'
        },
        {
          datafield: 'required',
          text: 'Обязательное',
          input: 'checkbox'
        },
        {
          datafield: 'description',
          text: 'Описание'
        },
        {
          datafield: 'default',
          text: 'Значение по умолчанию'
        }
      ]
    }
  },
  methods: {
    mapcomponentproperty (propertyname, holder) {
      const info = this
      const value = holder[info.property][propertyname]
      return {
        propertyname: propertyname,
        type: info.resolvetype(value.type),
        description: value.description,
        required: value.required,
        default: info.resolvedefault(value.default)
      }
    },
    resolvetype (propertyvalue) {
      const info = this

      if (Array.isArray(propertyvalue)) {
        return propertyvalue.map(m => info.resolvetype(m))
      } else if (typeof propertyvalue === 'function') {
        return propertyvalue.name
      }
    },
    resolvedefault (check) {
      if (typeof check === 'function') return utils.extractarguments(check)
      return check
    }
  }
}
</script>

<style>

</style>
