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
  const winningTrios = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  let array = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    for (let i = 0; i < boardSpots.length; i++) {
      boardSpots[i].textContent = array[i];
    }
  }
  const placeSign = (i) => {
    array[i] = gameControler.getCurrentPlayer().getSign()
  }
  const checkIfSameSign = (index1, index2, index3) => {
    if (array[index1] === array[index2] && array[index1] === array[index3] && array[index1] !== "") {
      return true;
    }
  }
  const checkIfFull = () => {
    let i = 0;
    while (i < 9) {
      if (array[i] === "") {
        return false;
      }
      i++;
    }
    return true;
  }
  const checkForWin = () => {
    let result;
    for (let i = 0; i < 8; i++) {
      result = checkIfSameSign(winningTrios[i][0], winningTrios[i][1], winningTrios[i][2]);
      if (result === true) {
        return true;
      }
    }
  }
  const resetBoard = () => {
    array = ["", "", "", "", "", "", "", "", ""];
    render();
  }
  const makeAMove = (i) => {
    if (array[i] == "") {
      placeSign(i);
      render();
      if (checkForWin() === true) {
        console.log(gameControler.getCurrentPlayer().getName() + " won!");
        gameControler.getCurrentPlayer().addPoints();
        resetBoard();
      } else if (checkIfFull() === true) {
        console.log("It's a tie!");
        resetBoard();
      }
      gameControler.changeCurrentPlayer();
    }
  }
  const bindBoardEvents = () => {
    for (let i = 0; i < boardSpots.length; i++) {
      boardSpots[i].addEventListener("click", () => {
        makeAMove(i);
      })
    }
  }
  return { resetBoard, bindBoardEvents };
})();

const gameControler = (() => {
  const restartButton = document.getElementById("restart");
  const changeVSButton = document.getElementById("changeVS");
  let players = [];
  const currentPlayer = { number: 0 };
  const createPlayers = () => {
    players[0] = playerFactory("Adam", "X");
    players[1] = playerFactory("Eve", "O");
  }
  const init = () => {
    createPlayers();
    gameBoard.resetBoard();
    gameBoard.bindBoardEvents();
    bindControlerEvents();
  }
  const changeCurrentPlayer = () => {
    if (currentPlayer.number === 0) {
      currentPlayer.number = 1;
    } else {
      currentPlayer.number = 0;
    }
  }
  const restart = () => {
    createPlayers();
    gameBoard.resetBoard();
    currentPlayer.number = 0;
  }
  const bindControlerEvents = () => {
    restartButton.addEventListener("click", restart);
  }
  const getCurrentPlayer = () => { return players[currentPlayer.number] };
  return { init, createPlayers, changeCurrentPlayer, getCurrentPlayer, restart };
})();

gameControler.init();