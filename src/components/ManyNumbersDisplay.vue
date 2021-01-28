<template>
  <div
      :class="{visible: values.includes(num)}"
      class="number-display"
  >{{num}}
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: ['ManyNumbersDisplay'],
  props: ['num', 'values'],

})
</script>

<style lang="sass" scoped>

.number-display
  width: calc(100% / 3)
  height: calc(100% / 3)
  font-size: 2vh
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  opacity: 0

.visible
  opacity: 1
</style>