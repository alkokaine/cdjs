<template>
  <cd-list :collection="carousel"></cd-list>
</template>

<script>
import CDList from './cd-list.vue'
export default {
    components: {
        'cd-list': CDList
    },
    props: {
        carousel: { type: Array }
    }
}
</script>

<style>

</style>