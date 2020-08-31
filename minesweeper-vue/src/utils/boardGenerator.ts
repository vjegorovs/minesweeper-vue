import { deepSpread } from "./deepSpread";
import { fieldCell } from "../types/fieldCell";

export const generateBoard = (
  boardSize: number,
  bombCount: number
): fieldCell[][] => {
  const board: fieldCell[] = new Array(boardSize).fill(<fieldCell>{
    value: 0,
    cellId: null,
    isPressed: false,
    isAlternatePressed: false,
  });
  const finalBoard: fieldCell[][] = board.map(() => {
    return deepSpread(board);
  });

  let uniqueId = 1;

  const mappedFinalBoard: fieldCell[][] = finalBoard.map((row) => {
    return row.map((cell) => {
      cell.cellId = uniqueId++;
      return deepSpread(cell);
    });
  });

  return bombPlacement(bombCount, mappedFinalBoard);
};

const bombPlacement = (
  bombCount: number,
  board: fieldCell[][]
): fieldCell[][] => {
  let bombs: number = bombCount;
  const newBoard: fieldCell[][] = deepSpread(board);
  const bombList: number[][] = [];

  while (bombs > 0) {
    const randomX: number = Math.floor(Math.random() * board.length);
    const randomY: number = Math.floor(Math.random() * board.length);

    if (newBoard[randomY][randomX].value !== "💣") {
      newBoard[randomY][randomX].value = "💣";
      bombList.push([randomY, randomX]);
      bombs--;
    }
  }

  return adjacentPlacement(newBoard, bombList);
};

const adjacentPlacement = (
  board: fieldCell[][],
  bombList: number[][]
): fieldCell[][] => {
  const newBoard: fieldCell[][] = deepSpread(board);

  bombList.forEach((bombPosition) => {
    const [y, x] = <number[]>bombPosition;

    for (let localY: number = y - 1; localY < y + 2; localY++) {
      if (localY < 0 || localY > newBoard.length - 1) continue;

      for (let localX: number = x - 1; localX < x + 2; localX++) {
        if (localX < 0 || localX > newBoard.length - 1) continue;
        if (newBoard[localY][localX].value !== "💣") {
          newBoard[localY][localX].value = newBoard[localY][localX].value + 1;
        }
      }
    }
  });

  return newBoard;
};
