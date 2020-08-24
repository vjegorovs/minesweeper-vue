<template>
  <button
    :class="{ pressed: isPressed }"
    :style="{ color: digitColor }"
    @click="mousePress($event)"
    @contextmenu.prevent="mousePress($event)"
  >
    {{ number }}
  </button>
</template>

<script lang="ts">
import {
  computed,
  inject,
  ref,
  toRefs,
  toRef,
  watchEffect,
  onUpdated,
} from "vue";
import { Colors } from "../enums/colors";

export default {
  name: "App",
  components: {},
  props: {
    cellValue: [Number, String],
    forceRevealCoordinates: Array,
    coordinates: Array,
  },
  setup(props, { emit }) {
    const { cellValue } = toRefs(props);

    const isPressed = ref(false);
    const isAlternatePressed = ref(false);
    const allowClick = inject("startGame", false);

    const digitColor = computed(() => {
      switch (props.cellValue) {
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
    function mousePress(e) {
      if (!allowClick.value) return;
      console.log("clicked");
      if (e.button === 2) {
        isAlternatePressed.value = !isAlternatePressed.value;
      } else {
        isPressed.value = true;
      }
    }
    onUpdated(() => {
      watcher();
    });
    const watcher = watchEffect(() => {
      //console.log("trigger watch");

      const { forceRevealCoordinates } = toRefs(props);
      console.log(
        forceRevealCoordinates.value[forceRevealCoordinates.value.length - 1]
      );

      forceRevealCoordinates.value[
        forceRevealCoordinates.value.length - 1
      ].forEach((e) => {
        if (
          !isPressed.value &&
          e.targetY == props.coordinates[0] &&
          e.targetX == props.coordinates[1]
        ) {
          mousePress({ button: 1 });
        }
      });
      //   forceRevealCoordinates.value[
      //     forceRevealCoordinates.value.length - 1
      //   ].forEach((e) => {
      //     if (
      //       !isPressed.value &&
      //       e.targetY == props.coordinates[0] &&
      //       e.targetX == props.coordinates[1]
      //     ) {
      //       forceReveal();
      //     }
      //   });

      return;
    });
    function forceReveal() {
      isPressed.value = true;
    }
    const number = computed(() => {
      if (!isPressed.value && isAlternatePressed.value) return "🚩";
      if (isPressed.value) {
        if (props.cellValue === 0) {
          emit("zeroCell");
        } else if (props.cellValue === "💣") {
          emit("gameover");
          return "💣";
        } else return props.cellValue;
      } else {
        return "";
      }
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
    border: 0;
    outline: none;
  }
  &:focus {
    border: 0;
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
