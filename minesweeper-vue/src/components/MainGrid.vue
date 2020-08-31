<template>
  <div class="wrap">
    <div class="row" v-for="(row, indexRow) in board" :key="indexRow">
      <grid-cell
        class="cell"
        v-for="(cell, indexCell) in row"
        :key="cell.cellId"
        :cellObject="board[indexRow][indexCell]"
        @zeroCell="zeroCellHandler(indexRow, indexCell)"
        @gameover="gameover"
        @flag="bombs++"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  inject,
  toRefs,
  ref,
  reactive,
  nextTick,
  onUpdated,
} from "vue";
import GridCell from "./GridCell.vue";
import { deepSpread } from "../utils/deepSpread";
import { fieldCell } from "../types/fieldCell";

export default {
  name: "App",
  components: { GridCell },
  props: {
    board: Array,
  },
  setup(props, { emit }) {
    const { board } = toRefs(props);
    onUpdated(() => console.log("component rerender"));

    const zeroCellHandler = (row, cell) => {
      const y = row;
      const x = cell;
      const toBeOpened = [];
      for (let localY: number = y - 1; localY < y + 2; localY++) {
        if (localY < 0 || localY > board.value.length - 1) continue;

        for (let localX: number = x - 1; localX < x + 2; localX++) {
          if (localX < 0 || localX > board.value.length - 1) continue;
          if (localX !== x || localY !== y) {
            toBeOpened.push([localY, localX]);
          }
        }
      }

      toBeOpened.forEach((coordinates) => {
        if (board.value[coordinates[0]][coordinates[1]].isAlternatePressed) {
          board.value[coordinates[0]][
            coordinates[1]
          ].isAlternatePressed = false;
        }
        board.value[coordinates[0]][coordinates[1]].isPressed = true;
      });
    };

    const gameover = (gameOverCode: number): void => {
      //add check if victory gameover and return false to return checkmark in template
      board.value.forEach((row) => {
        row.forEach((cell) => {
          cell.isAlternatePressed = false;
          cell.isPressed = true;
        });
      });
      emit("gameover", gameOverCode);
    };

    return {
      board,
      zeroCellHandler,
      gameover,
    };
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80vw;
  height: 80vh;
  margin-left: 10vw;
}

.row {
  display: flex;
  flex-direction: row;
  + .row {
    margin-top: 1px;
  }
}
</style>
