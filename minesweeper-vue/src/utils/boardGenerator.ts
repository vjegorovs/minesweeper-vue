import { deepSpread } from "./deepSpread";

export const generateBoard = (
  boardSize: number,
  bombCount: number
): (number | string)[][] => {
  const board: (number | string)[] = new Array(boardSize).fill(0);

  const finalBoard: (number | string)[][] = board.map((e) => {
    return [...board];
  });

  return bombPlacement(bombCount, finalBoard);
};

const bombPlacement = (
  bombCount: number,
  board: (number | string)[][]
): (number | string)[][] => {
  let bombs: number = bombCount;
  const newBoard: (number | string)[][] = deepSpread(board);
  const bombList: number[][] = [];

  while (bombs > 0) {
    const randomX: number = Math.floor(Math.random() * board.length);
    const randomY: number = Math.floor(Math.random() * board.length);

    if (newBoard[randomY][randomX] !== "💣") {
      newBoard[randomY][randomX] = "💣";
      bombList.push([randomY, randomX]);
      bombs--;
    }
  }

  return adjacentPlacement(newBoard, bombList);
};

const adjacentPlacement = (
  board: (number | string)[][],
  bombList: number[][]
): (number | string)[][] => {
  const newBoard: (number | string)[][] = deepSpread(board);

  bombList.forEach((bombPosition) => {
    const [y, x] = <number[]>bombPosition;

    for (let localY: number = y - 1; localY < y + 2; localY++) {
      if (localY < 0 || localY > newBoard.length - 1) continue;

      for (let localX: number = x - 1; localX < x + 2; localX++) {
        if (localX < 0 || localX > newBoard.length - 1) continue;
        if (newBoard[localY][localX] !== "💣") {
          newBoard[localY][localX] = newBoard[localY][localX] + 1;
        }
      }
    }
  });

  return newBoard;
};
