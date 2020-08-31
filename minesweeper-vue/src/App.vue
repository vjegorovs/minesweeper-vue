<template>
  <div class="view">
    <div class="settings-bar">
      <ul>
        <li v-for="(setting, index) in settingsArray" :key="index+setting">
          <label :for="setting">{{ setting }}</label>
          <input
            type="radio"
            :id="setting"
            :value="setting"
            v-model="globalReactiveState.difficulty"
            :disabled="globalReactiveState.clickable ? true : false"
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
          :disabled="globalReactiveState.clickable ? true : false"
          v-model.number="globalReactiveState.gridSize"
        />
        <label
          for="Size"
        >Size: {{ globalReactiveState.gridSize }} x {{ globalReactiveState.gridSize }}</label>
      </div>
      <button class="begin-game" @click="startGame">
        <span v-if="globalReactiveState.startGame && globalReactiveState.clickable">Re-</span>Start
      </button>
    </div>
    <div class="game-status">
      <div class="bombcount">💣 left: {{ bombCount - bombCounter }}</div>
    </div>
    <main-grid :board="field" @gameover="victoryScreen" />
  </div>
</template>

<script lang="ts">
import { reactive, computed, provide, ref, ComputedRef, Ref } from "vue";
import MainGrid from "./components/MainGrid.vue";
import GridCell from "./components/GridCell.vue";
import { Settings } from "./enums/settings";
import { generateBoard } from "./utils/boardGenerator";
import { fieldCell } from "./types/fieldCell";

export default {
  name: "App",
  components: {
    MainGrid,
    GridCell,
  },
  setup() {
    const settingsArray = ["Easy", "Medium", "Hard"];
    const globalReactiveState = reactive({
      gridSize: 10,
      difficulty: "Easy",
      startGame: false,
      clickable: false,
    });
    provide("globalSettings", globalReactiveState);

    const bombCount = computed(() => {
      const fieldsCount =
        globalReactiveState.gridSize * globalReactiveState.gridSize;
      const bombCount = Math.floor(
        fieldsCount /
          Settings[`${globalReactiveState.difficulty.toUpperCase()}`]
      );
      return bombCount;
    });

    // similar for victory true/false
    const bombCounter = computed((): number => {
      console.log("bombcounter computed");
      if (!globalReactiveState.startGame) return 0;
      return field.value.reduce((accumulator, row) => {
        return (
          row.filter((cell) => {
            return cell.isAlternatePressed === true;
          }).length + accumulator
        );
      }, 0);
    });

    const fakeBoard: fieldCell[][] = new Array(15).fill({}).map((e) => {
      return [
        ...new Array(15).fill(<fieldCell>{
          value: null,
          cellId: null,
          isPressed: false,
          isAlternatePressed: false,
        }),
      ];
    });

    const field: ComputedRef<fieldCell[][]> = computed(() => {
      // visual output of field without values to be slightly faster

      return globalReactiveState.startGame
        ? reactive(generateBoard(globalReactiveState.gridSize, bombCount.value))
        : fakeBoard
            .slice(0, globalReactiveState.gridSize)
            .map((row) => row.slice(0, globalReactiveState.gridSize));
    });

    const startGame = (): void => {
      // very fast and easy solution to handle re-start events as well if user doesnt want to resize
      globalReactiveState.startGame = false;
      globalReactiveState.startGame = true;
      globalReactiveState.clickable = true;
    };

    const victoryScreen = (gameOverCode: number): void => {
      globalReactiveState.clickable = false;
    };

    return {
      field,
      bombCount,
      bombCounter,
      victoryScreen,
      globalReactiveState,
      settingsArray,
      startGame,
    };
  },
};
</script>

<style lang="scss" scoped>
.view {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.settings-bar,
.game {
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: tan;
  > button {
    margin-left: 2%;
  }
}

.game-status {
  margin: 1vh 0 1vh 0;
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
