<template>
  <span
      :class="{active: activeValue === num}"
      class="number-panel-item"
      @click="$emit('addActiveValue', num)"
  >{{num}}
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  emits: ['addActiveValue'],
  name: 'NumberPanelItem',
  props: ['num', 'activeValue'],
})
</script>

<style lang="sass" scoped>
.number-panel-item
  font-size: 3vh
  width: min(5vh, 7.5vw)
  height: min(5vh, 7.5vw)
  color: white
  background-color: rgba(23, 20, 20, .9)
  border-radius: .5vh
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  cursor: pointer

  &:hover
    background-color: rgba(23, 20, 20, .5)

.active
  background-color: rgba(200, 25, 25, .94)

  &:hover
    background-color: rgba(200, 25, 25, .84)


</style>