const playerFactory = (name, sign) => {
  let points = 0;
  const addPoints = function () {
    points += 1;
  }
  const resetPoints = function () {
    points = 0;
  }
  const setName = function (newName) {
    name = newName;
  }
  const setSign = function (newSign) {
    sign = newSign;
  }
  const getPoints = () => { return points };
  const getName = () => { return name };
  const getSign = () => { return sign };
  return { getPoints, addPoints, resetPoints, setName, getName, setSign, getSign };
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
  let players = [];
  const createPlayers = () => {
    players[0] = playerFactory("Adam", "X");
    players[1] = playerFactory("Eve", "O");
  }
  const init = () => {
    createPlayers();
    gameBoard.render();
  }
  return { init, createPlayers, players };
})();

gameControler.init();