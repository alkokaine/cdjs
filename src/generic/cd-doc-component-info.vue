<template>
  <div>
    <h3>{{ component.name }}</h3>
    <cd-grid keyfield="propertyname" :collection="data" :descriptor="descriptor" :allownew="false"></cd-grid>
  </div>
</template>

<script>
import CDGrid from '@/components/cd-grid.vue'
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
      data: Array.from(Object.keys(info.component[info.property]))
        .map(pname => info.mapcomponentproperty(pname, info.component[info.property])),
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
        }
      ]
    }
  },
  methods: {
    mapcomponentproperty (propertyname, holder) {
      const info = this
      const value = holder[propertyname]
      return {
        propertyname: propertyname,
        type: info.resolvetype(value, 'type'),
        description: value.description,
        required: value.required
      }
    },
    resolvetype (value, property) {
      const info = this
      const propertyvalue = (value[property] || value)
      const resolveddefault = value.default
      if (Array.isArray(propertyvalue)) {
        return propertyvalue.map(variant => variant.name)
      } else if (propertyvalue !== undefined) {
        if (typeof propertyvalue === 'function' && propertyvalue.name === 'Function' && property !== 'returns') {
          return `${propertyvalue.name}: ${utils.extractarguments(value.default)} => ${info.resolvetype(value, 'returns')}`
        } else {
          if ((resolveddefault || typeof resolveddefault === 'boolean') && typeof resolveddefault !== 'function') return `${propertyvalue.name}, default: ${resolveddefault}`
          return `${propertyvalue.name}`
        }
      }
    }
  }
}
</script>

<style>

</style>
