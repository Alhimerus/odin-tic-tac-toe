(function () {
  const playerFactory = (name, sign) => {
    let points = 0;
    return { name, sign, points };
  }

  const gameBoard = (() => {
    let array =
      [["X", "O", "X"],
      ["O", "X", "O"],
      ["O", "X", "O"]];
    return { array };
  })();

  const gameControler = (() => {
    return {};
  })();

  const player1 = playerFactory("Adam", "X");
  const player2 = playerFactory("Eve", "O");
})();