<template>
  <div>
    <Number
        v-for="(number, key) of circle"
        :key="key"
        :activeValue="activeValue"
        :completeCounter="completeCounter"
        :elements="elements"
        :number="number"
        @addCompleteCounter="$emit('addCompleteCounter')"
        @decreaseCompleteCounter="$emit('decreaseCompleteCounter')"
        @saveProgress="$emit('saveProgress')"
    />
  </div>
</template>

<script lang="ts">
import Number from '@/components/Number.vue'
import {defineComponent} from 'vue'

export default defineComponent({
  props: ['circle', 'activeValue', 'completeCounter', 'elements'],
  components: {
    Number,
  },
})
</script>

<style lang="sass" scoped>
.circle
  width: calc(100% / 3)
  height: min(calc(70vh / 3), calc(100vw / 3))
  background-color: rgba(0, 0, 0, .3)
  border: 1vh solid black
  display: flex
  flex-direction: row
  flex-wrap: wrap
</style>