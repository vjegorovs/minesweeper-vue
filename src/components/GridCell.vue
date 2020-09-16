<template>
  <button
    :class="{ pressed: isPressed }"
    :style="{ color: digitColor }"
    @click="mousePress($event)"
    @contextmenu.prevent="mousePress($event)"
  >{{ number }}</button>
</template>

<script lang="ts">
import { computed, inject, ref, toRefs, onRenderTriggered } from "vue";
import { Colors } from "../enums/colors";
import { Cell } from "../enums/cell";

export default {
  name: "App",
  components: {},
  props: {
    cellObject: Object,
  },
  setup(props, { emit }) {
    const { cellObject } = toRefs(props);
    const isPressed = computed(() =>
      cellObject.value.isPressed === true ? true : false
    );
    const digitColor = computed(() => {
      switch (cellObject.value.value) {
        case 1:
          return Colors.GREEN;
        case 2:
          return Colors.BLUE;
        case 3:
          return Colors.PURPLE;
        case 4:
          return Colors.ORANGE;
        default:
          return Colors.RED;
      }
    });

    const globalSettings = inject("globalSettings", {
      gridSize: 10,
      difficulty: "Easy",
      startGame: false,
      clickable: false,
    });

    function mousePress(e: MouseEvent): void {
      console.log("mousePress function");

      if (!globalSettings.clickable) return;
      if (e.button === 2) {
        if (cellObject.value.isPressed === true) return;
        if (cellObject.value.isAlternatePressed) {
          cellObject.value.isAlternatePressed = false;
          return;
        } else {
          cellObject.value.isAlternatePressed = true;
          return;
        }
      } else {
        if (cellObject.value.isAlternatePressed) {
          cellObject.value.isAlternatePressed = false;
        }
        cellObject.value.isPressed = true;
      }
    }

    const number =
      cellObject.value.value === null
        ? ""
        : computed(() => {
            if (cellObject.value.isAlternatePressed) {
              return "🚩";
            } else if (cellObject.value.isPressed) {
              cellObject.value.isAlternatePressed = false;
              if (cellObject.value.value === 0) {
                emit("zeroCell");
              }
              if (cellObject.value.value === "💣") {
                emit("gameover", 0);
              }
              return cellObject.value.value === "💣"
                ? "💣"
                : cellObject.value.value === 0
                ? ""
                : cellObject.value.value;
            }

            return "";
          });

    return { number, digitColor, isPressed, mousePress };
  },
};
</script>

<style lang="scss" scoped>
button {
  height: 50px;
  width: 50px;
  background-color: beige;
  transition-delay: 0.1s;
  + .cell {
    margin-left: 1px;
  }
  cursor: pointer;
  border: 1px solid #e7e8ec;
  color: black;
  font-size: 1.5em;

  &:active {
    outline: none;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: rgba(245, 245, 220, 0.702);
    transition-delay: 0s;
  }
}

.pressed {
  background-color: white;
  &:hover {
    background-color: white;
  }
}
</style>
