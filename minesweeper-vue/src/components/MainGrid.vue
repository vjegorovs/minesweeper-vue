<template>
  <div class="wrap">
    <div class="row" v-for="(row, indexRow) in board" :key="Math.random()">
      <grid-cell
        class="cell"
        v-for="(cell, indexCell) in row"
        :key="Math.random()"
        :cellValue="cell"
        :forceRevealCoordinates="forceReveal"
        :coordinates="[indexRow, indexCell]"
        @zeroCell="zeroCellHandler(indexRow, indexCell)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, inject, toRefs, ref, reactive, nextTick } from "vue";
import GridCell from "./GridCell.vue";

export default {
  name: "App",
  components: { GridCell },
  props: {
    board: Array,
  },
  setup(props) {
    const { board } = toRefs(props);
    const forceReveal = ref([[{ targetY: -1, targetX: -1 }]]);
    const zeroCellHandler = (row, cell) => {
      //   console.log("The pressed cell is: ", row, cell);
      //   console.log(board.value);

      const y = row;
      const x = cell;
      const tempArray = [];
      for (let localY: number = y - 1; localY < y + 2; localY++) {
        if (localY < 0 || localY > board.value.length - 1) continue;

        for (let localX: number = x - 1; localX < x + 2; localX++) {
          if (localX < 0 || localX > board.value.length - 1) continue;
          //console.log("123");

          if (localX !== x || localY !== y) {
            tempArray.push({
              targetY: localY,
              targetX: localX,
            });
          }
        }
      }
      forceReveal.value.push(tempArray);
    };

    return { board, zeroCellHandler, forceReveal };
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
