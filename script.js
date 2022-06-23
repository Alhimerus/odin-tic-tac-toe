(function () {
  const playerFactory = (name, sign) => {
    let points = 0;
    return { name, sign, points };
  }

  const gameBoard = (() => {
    const boardSpots = document.getElementsByClassName("spot");
    let array =
      ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
    const render = () => {
      for (let i = 0; i < boardSpots.length; i++) {
        boardSpots[i].textContent = array[i];
      }
    }
    return { render };
  })();

  const gameControler = (() => {
    return {};
  })();

  const player1 = playerFactory("Adam", "X");
  const player2 = playerFactory("Eve", "O");
  gameBoard.render();
})();