<template>
  <div class="game">
    <div
        v-if="!isGame"
        class="difficult">

      <span>СУДОКУ!</span>

      <span>Выберите сложность</span>

      <div class="stuck-buttons">
        <button
            :class="{'active-difficult': this.difficult === 43}"
            @click="changeDifficult(43)">Легко
        </button>

        <button
            :class="{'active-difficult': this.difficult === 35}"
            @click="changeDifficult(35)">Средне
        </button>

        <button
            :class="{'active-difficult': this.difficult === 0}"
            @click="changeDifficult(0)">Сложно
        </button>
      </div>
    </div>

    <div v-if="!isGame">
      <button
          class="start"
          @click="startGame">Начать игру!
      </button>
    </div>

    <div
        v-if="isGame"
        :class="{complete: completeCounter === elements}"
        class="sudoku">
      <Circle
          v-for="(circle, key) of circles"
          :key="key"
          :activeValue="activeValue"
          :circle="circle"
          :completeCounter="completeCounter"
          :elements="elements"
          class="circle"
          @addCompleteCounter="addCompleteCounter"
          @decreaseCompleteCounter="decreaseCompleteCounter"
      />

      <div class="number-panel">
        <NumberPanelItem
            v-for="num of numbers"
            v-if="completeCounter !== elements"
            :activeValue="activeValue"
            :num="num"
            @addActiveValue="addActiveValue"
        />

        <button
            v-if="completeCounter === elements"
            class="start"
            @click="newGame"
        >Начать Заного
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Circle from '@/components/Circle.vue'
import NumberPanelItem from '@/components/NumberPanelItem.vue'
import {arrangeElements, getInitialValues, makeObjectsFromSudokuArray, makePlayground, SudokuElement} from '@/api/api'

export default defineComponent({
  name: 'Home',
  components: {
    Circle,
    NumberPanelItem,
  },
  data: () => ({
    difficult: 35,
    isGame: false,
    completeCounter: 0 as number,
    elements: 0 as number,
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9] as number[],
    activeValue: 0,
    circles: [] as SudokuElement[][],
  }),
  methods: {
    addActiveValue(num: number) {
      if (this.activeValue === num) this.activeValue = 0
      else this.activeValue = num
    },
    addCompleteCounter() {
      this.completeCounter++
      if (this.completeCounter === this.elements) this.activeValue = 0
    },
    decreaseCompleteCounter() {
      this.completeCounter--
    },
    startGame() {
      this.isGame = true
      this.newGame()
    },
    newGame() {
      this.completeCounter = 0
      this.elements = 0
      this.$emit('game')

      const initialSudokuArray = getInitialValues().mixSudokuArray().reverse().mixSudokuArray()
      const objectsSudokuArray = makeObjectsFromSudokuArray(initialSudokuArray.arr)
      const sudoku = arrangeElements(objectsSudokuArray)

      makePlayground(sudoku, this.difficult)

      this.circles = sudoku.circles

      for (let i in this.circles) {
        for (let j in this.circles) {
          if (this.circles[i][j].visible) this.completeCounter++
          this.elements++
          this.circles[i][j].possibleValues = []
        }
      }
    },
    changeDifficult(difficult: number) {
      this.difficult = difficult
    },
  },
})
</script>

<style lang="sass">

.game
  width: 100%
  height: 100%
  min-height: 100vh
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.difficult
  width: 100%
  height: 100%
  display: flex
  font-size: 3vh
  flex-direction: column
  justify-content: center
  align-items: center
  padding: 2vh

.stuck-buttons
  display: flex
  font-size: 3vh
  margin-top: 2vh
  flex-direction: row
  justify-content: center
  flex-wrap: wrap
  align-items: center

.stuck-buttons > *
  margin: 0
  padding: 1vh 2vh
  font-size: 3vh

.stuck-buttons > * + *
  margin-left: .5vh

.stuck-buttons > button
  border: none
  cursor: pointer
  background-color: #e9c46a
  border-radius: .5vh
  transition: opacity .3s ease-out

  &:hover
    opacity: .85

  &:focus,
  &:active
    outline: none

.stuck-buttons > .active-difficult
  background-color: green
  color: white

.sudoku
  width: min(70vh, 100vw)
  height: min(70vh, 100vw)
  background-color: rgba(0, 0, 0, .3)
  display: flex
  flex-direction: row
  flex-wrap: wrap

.number-panel
  display: flex
  flex-direction: row
  width: 100%
  justify-content: space-between
  padding: min(5vh, 5vw)

.complete
  background-color: green

.start
  background-color: green
  color: white
  cursor: pointer
  font-size: 3vh
  width: 100%
  height: 100%
  border-radius: 1vh
  border: none
  padding: .5vh 4vh
  transition: all .3s ease-out

  &:hover
    background-color: rgba(25, 200, 25, .94)

  &:active,
  &:focus
    outline: none

</style>
