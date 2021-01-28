<template>
  <div class="number" @click="addValue(activeValue)">
    <span
        :class="{visible: number.visibleOnTable || completeCounter === elements, active: activeValue === number.value}"
        class="value"
    >{{number.value}}</span>

    <div
        v-if="number.possibleValues.length === 1 && !manyVisible"
        :class="{active: activeValue === number.possibleValues[0]}"
        class="single"
    >{{number.possibleValues[0]}}
    </div>

    <div class="many">
      <ManyNumbersDisplay
          v-for="num of numbers"
          v-if="number.possibleValues.length >= 2 || manyVisible"
          v-bind:num="num"
          v-bind:values="number.possibleValues"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import ManyNumbersDisplay from '@/components/ManyNumbersDisplay.vue'

export default defineComponent({
  name: 'Number',
  props: ['number', 'activeValue', 'completeCounter', 'elements'],
  emits: ['addCompleteCounter', 'decreaseCompleteCounter'],
  components: {
    ManyNumbersDisplay,
  },
  computed: {},
  data: () => ({
    addedCounter: false,
    manyVisible: false,
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9] as number[],
    values: [] as number[],
  }),
  methods: {
    addValue(num: number) {
      if (this.number.visibleOnTable || this.activeValue === 0) return

      if (this.number.possibleValues.includes(num) && !this.manyVisible) {
        this.manyVisible = true
      } else if (this.number.possibleValues.includes(num) && this.manyVisible) {
        this.number.possibleValues = this.number.possibleValues.filter((v: any) => v !== num)
        if (this.number.possibleValues.length === 0) this.manyVisible = false
      } else {
        this.number.possibleValues.push(num)
        if (this.number.possibleValues.length >= 2) this.manyVisible = true
      }

      if (this.number.possibleValues.length === 1 && this.number.possibleValues[0] === this.number.value && !this.manyVisible) {
        this.$emit('addCompleteCounter')
        if (this.completeCounter + 1 === this.elements) {
          this.number.possibleValues = []
          return
        }
        this.addedCounter = true
      } else if (this.number.possibleValues.length !== 1 && this.addedCounter) {
        this.$emit('decreaseCompleteCounter')
        this.addedCounter = false
      }
    },
  },
})
</script>

<style lang="sass" scoped>
.number
  position: relative
  width: calc(100% / 3)
  height: calc(100% / 3)
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  border: .25vh solid blueviolet
  font-size: min(5vh, 5vw)
  cursor: pointer
  transition: all .3s ease

  &:hover
    background-color: blueviolet

.value
  width: 100%
  height: 100%
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  opacity: 0

.visible
  opacity: 1

.active
  background-color: rgba(200, 25, 25, .94)

.single
  width: 100%
  height: 100%
  left: 0
  top: 0
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  position: absolute
  color: rgba(23, 20, 20, .84)

.many
  position: absolute
  left: 0
  top: 0
  display: flex
  width: 100%
  height: 100%
  flex-direction: row
  flex-wrap: wrap
  justify-content: center
  align-items: center

</style>