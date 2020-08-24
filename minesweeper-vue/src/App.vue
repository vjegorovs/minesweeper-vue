<template>
  <div class="view">
    <div class="settings-bar">
      <ul>
        <li>
          <label for="Easy">Easy</label>
          <input
            type="radio"
            id="EASY"
            value="EASY"
            v-model="difficultySetting"
          />
        </li>
        <li>
          <label for="Medium">Medium</label>
          <input
            type="radio"
            id="MEDIUM"
            value="MEDIUM"
            v-model="difficultySetting"
          />
        </li>
        <li>
          <label for="Hard">Hard</label>
          <input
            type="radio"
            id="HARD"
            value="HARD"
            v-model="difficultySetting"
          />
        </li>
      </ul>
      <div>
        <input
          type="range"
          id="Size"
          name="Size"
          min="5"
          max="15"
          step="1"
          v-model.number="gridSize"
        />
        <label for="Size">Size: {{ gridSize }}</label>
      </div>
      <div class="difficulty">Bombs: {{ bombCount }}</div>
      <button class="begin-game" @click="startGame = true">
        Start
      </button>
    </div>
    <main-grid :board="field" />
  </div>
</template>

<script lang="ts">
import { reactive, computed, provide, ref, ComputedRef, Ref } from "vue";
import MainGrid from "./components/MainGrid.vue";
import GridCell from "./components/GridCell.vue";
import { Settings } from "./enums/settings";
import { generateBoard } from "./utils/boardGenerator";

export default {
  name: "App",
  components: {
    MainGrid,
    GridCell,
  },
  setup() {
    const global = computed(() => {
      return {
        difficulty: difficultySetting,
        size: gridSize,
      };
    });
    const difficultySetting = ref("EASY");
    const gridSize = ref(10);
    const bombCount = computed(() => {
      const fieldsCount = gridSize.value * gridSize.value;
      const bombCount = Math.floor(
        fieldsCount / Settings[`${difficultySetting.value}`]
      );
      return bombCount;
    });
    const startGame: Ref<boolean> = ref(false);
    provide("startGame", startGame);
    const field: ComputedRef<(number | string)[][]> = computed(() => {
      // visual output of field without values to be slightly faster
      const fakeBoard: (number | string)[][] = new Array(gridSize.value)
        .fill(0)
        .map((e) => {
          return [...new Array(gridSize.value).fill(0)];
        });

      return startGame.value
        ? generateBoard(gridSize.value, bombCount.value)
        : fakeBoard;
    });

    return {
      difficultySetting,
      gridSize,
      field,
      bombCount,
      startGame,
    };
  },
};
</script>

<style lang="scss" scoped>
.settings-bar {
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: tan;
}

ul {
  list-style: none inside;
  width: 10em;
  margin: 0;
  padding: 0;
  > li {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 1.2em;
    > label {
      display: inline-block;
      text-align: left;
      width: 50%;
      font-size: 1.2em;
    }
  }
}
</style>
