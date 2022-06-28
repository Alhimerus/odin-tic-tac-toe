const playerFactory = (name) => {
  let points = 0;
  const addPoints = function () {
    this.points += 1;
  }
  const resetPoints = function () {
    this.points = 0;
  }
  const setName = function (newName) {
    this.name = newName;
  }
  return { name, points, addPoints, resetPoints, setName };
}

const gameBoard = (() => {
  const boardSpots = document.getElementsByClassName("spot");
  let array = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];

  const render = () => {
    for (let i = 0; i < boardSpots.length; i++) {
      boardSpots[i].textContent = array[i];
    }
  }
  return { render };
})();

const gameControler = (() => {
  const init = () => {
    gameBoard.render()
  }
  return { init };
})();

gameControler.init();