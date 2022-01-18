<template>
  <cd-list class="cd-properties" listclass="property-list" rowclass="property-descriptor" :collection="descriptor" keyfield="datafield" :listitemclicked="onpropertyclick">
    <div class="property-descriptor--inner" slot-scope="property" draggable="true" v-on:drag="ondrag($event, property)" v-on:drop="ondrop($event, property)" v-on:dragover="ondragover($event, property)">
      <button type="button" class="btn btn-link btn-sm bi bi-x-circle" v-on:click.stop="removeproperty($event, property.index)"></button>
      <el-popover trigger="click" :value="(zoomprop.index === property.index)" :disabled="popoff">
        <cd-form :descriptor="resolvedescriptor(property)" :payload="property.row" :onpropertychange="onpropertychange(property)"></cd-form>
        <button slot="reference" type="button" class="property-descriptor btn btn-link btn-sm">{{ property.row.datafield }}</button>
      </el-popover>
    </div>
  </cd-list>
</template>

<script>
import Vue from 'vue'
import basedescriptor from '@/examples/base-property-descriptor'
import inputproperty from '@/examples/input-property-descriptor'
import elpopover from 'element-ui/packages/popover'
import CDList from '../components/cd-list.vue'
import CDForm from '../components/cd-form.vue'

export default {
  name: 'cd-prop-list',
  components: {
    'cd-list': CDList,
    'el-popover': elpopover,
    'cd-form': CDForm
  },
  props: {
    popoff: { type: Boolean, default: false },
    descriptor: { type: Array, required: true },
    onremoveproperty: { type: Function, default: (property) => { } }
  },
  data (proplist) {
    return {
      zoomprop: Object
    }
  },
  computed: {
    isdisabled () {
      const list = this
      return (scope) => scope.index !== list.index
    },
    resolvedescriptor () {
      return (property) => {
        if (property.input === undefined) return basedescriptor
        else return inputproperty.concat(basedescriptor)
      }
    },
    onpropertychange () {
      return (descriptor) => {
        return (property, value) => {
          Vue.set(descriptor.row, property.datafield, value)
        }
      }
    }
  },
  methods: {
    ondrag (event, property) {
      console.log(property)
    },
    ondrop (event, property) {
      console.log(property)
    },
    ondragover (event, property) {
      event.preventDefault()
      console.log(property)
    },
    removeproperty (event, args) {
      this.descriptor.splice(args, 1)
      this.onremoveproperty(args)
    },
    onpropertyclick (event, prop) {
      this.zoomprop = prop
    },
    addproperty (...args) {
      console.log(args)
    },
    onpropertyedited (event, args) {

    }
  }
}
</script>

<style>
  ul.property-list {
    list-style-type: none;
  }
  .property-descriptor {
    padding-right: 5px;
    display: inline-block;
  }
  .property-descriptor--inner.dragElem {
    opacity: 0.4;
  }
  .property-descriptor--inner {
  }
  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }
  .property-drop {
    width: 25px;
    padding-left: 10px;
    padding-right: 10px;
    height: 25px;
  }

</style>
