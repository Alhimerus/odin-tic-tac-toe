const playerFactory = (name, sign) => {
  let points = 0;
  const addPoints = function () {
    points += 1;
  }
  const getPoints = () => { return points };
  const getName = () => { return name };
  const getSign = () => { return sign };
  return { getPoints, addPoints, getName, getSign };
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
  let boardArray = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    for (let i = 0; i < boardSpots.length; i++) {
      boardSpots[i].textContent = boardArray[i];
    }
  }
  const placeSign = (i) => {
    boardArray[i] = gameControler.getCurrentPlayer().getSign()
  }
  const checkIfSameSign = (index1, index2, index3) => {
    if (boardArray[index1] === boardArray[index2] && boardArray[index1] === boardArray[index3] && boardArray[index1] !== "") {
      return true;
    }
  }
  const checkIfFull = () => {
    let i = 0;
    while (i < 9) {
      if (boardArray[i] === "") {
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
    boardArray = ["", "", "", "", "", "", "", "", ""];
    render();
  }
  const makeAMove = (i) => {
    if (boardArray[i] == "") {
      placeSign(i);
      render();
      if (checkForWin() === true) {
        gameControler.showGameResult(gameControler.getCurrentPlayer().getName() + " won!");
        gameControler.getCurrentPlayer().addPoints();
        gameControler.updatePlayerInfo();
        resetBoard();
      } else if (checkIfFull() === true) {
        gameControler.showGameResult("It's a tie!");
        resetBoard();
      }
      gameControler.changeCurrentPlayer();
    }
  }
  const makeComputerMoveEasy = () => {
    let arrayWithEmptySpots = [];
    for (let i = 0; i < 9; i++) {
      if (boardArray[i] === "") {
        arrayWithEmptySpots.push(i);
      }
    }
    makeAMove(randomFromArray(arrayWithEmptySpots));
  }
  const makeComputerMoveHard = () => {
    let arrayWithSpotValues = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    winningTrios.forEach(trio => {
      arrayWithSpotValues[trio[0]] += getSpotValue(trio[0], trio[1], trio[2]);
      arrayWithSpotValues[trio[1]] += getSpotValue(trio[1], trio[0], trio[2]);
      arrayWithSpotValues[trio[2]] += getSpotValue(trio[2], trio[0], trio[1]);
    });
    let bestSpot = getIndexOfMaxValue(arrayWithSpotValues);
    makeAMove(bestSpot);
  }
  let getSpotValue = (spot1, spot2, spot3) => {
    if (boardArray[spot1] !== "") {
      return -10;
    }
    let pairValue;
    let getPairValue = () => {
      let firstValue = (boardArray[spot2] === "") ? 0 : ((boardArray[spot2] === gameControler.getCurrentPlayer().getSign()) ? 1 : 4);
      let secondValue = (boardArray[spot3] === "") ? 0 : ((boardArray[spot3] === gameControler.getCurrentPlayer().getSign()) ? 1 : 4);
      return firstValue + secondValue;
    }
    pairValue = getPairValue();
    switch (pairValue) {
      case 0: return 1;
      case 1: return 3;
      case 2: return 20;
      case 4: return 2;
      case 5: return -1;
      case 8: return 10;
    }
  }
  const getIndexOfMaxValue = (array) => {
    let maxValue = array[0];
    let maxIndex = 0;
    for (let i = 1; i < array.length; i++) {
      if (array[i] > maxValue) {
        maxValue = array[i];
        maxIndex = i;
      }
    }
    return maxIndex;
  }
  const randomFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  }
  const bindBoardEvents = () => {
    for (let i = 0; i < boardSpots.length; i++) {
      boardSpots[i].addEventListener("click", () => {
        if (gameControler.getCurrentPlayer() !== undefined) {
          makeAMove(i);
          if (gameControler.gamemode.value === "pvceasy" && gameControler.getCurrentPlayer().getName() === "Computer") {
            makeComputerMoveEasy();
          } else if (gameControler.gamemode.value === "pvcmedium" && gameControler.getCurrentPlayer().getName() === "Computer") {
            if(Math.floor(Math.random()*2)===0) {
              makeComputerMoveEasy();
            } else {
              makeComputerMoveHard();
            }
          } else if (gameControler.gamemode.value === "pvchard" && gameControler.getCurrentPlayer().getName() === "Computer") {
            makeComputerMoveHard();
          }
        }
      })
    }
  }
  return { resetBoard, bindBoardEvents };
})();

const gameControler = (() => {
  const newGameButton = document.getElementById("newGame");
  const changeVSSelect = document.getElementById("changeVS");
  const creationPlayerNames = document.querySelectorAll(".player-creation .name");
  const creationPlayerSigns = document.querySelectorAll(".player-creation>.sign>span");
  const changeSignsButton = document.getElementById("change-signs");
  const createPlayersButton = document.getElementById("create-players");
  const creationContainer = document.querySelector("div.container.player-creation")
  const playerInfoNames = document.querySelectorAll("#player-info .name");
  const playerInfoSigns = document.querySelectorAll("#player-info .sign span");
  const playerInfoScores = document.querySelectorAll("#player-info .score span");
  const gameResultButton = document.querySelector(".game-result button");
  const gameResultContainer = document.querySelector("div.container.game-result");
  const gameResultMessage = document.querySelector(".game-result span");
  const currentPlayerSpan = document.querySelector("div#current-player span");
  let players = [];
  const currentPlayer = { number: 0 };
  const gamemode = { value: "pvp" };
  const createPlayers = () => {
    players[0] = playerFactory(creationPlayerNames[0].value, creationPlayerSigns[0].textContent);
    players[1] = playerFactory(creationPlayerNames[1].value, creationPlayerSigns[1].textContent);
  }
  const init = () => {
    gameBoard.resetBoard();
    gameBoard.bindBoardEvents();
    bindControlerEvents();
    resetPlayerCreation();
  }
  const changeCurrentPlayer = () => {
    if (currentPlayer.number === 0) {
      currentPlayer.number = 1;
    } else {
      currentPlayer.number = 0;
    }
    updateCurrentPlayerSpan();
  }
  const restart = () => {
    changeVisibility(creationContainer);
    gameBoard.resetBoard();
    currentPlayer.number = 0;
    gamemode.value = "pvp";
  }
  const changeSigns = () => {
    if (creationPlayerSigns[0].textContent === "X") {
      creationPlayerSigns[0].textContent = "O";
      creationPlayerSigns[1].textContent = "X";
    } else {
      creationPlayerSigns[0].textContent = "X";
      creationPlayerSigns[1].textContent = "O";
    }
  }
  const changeVisibility = (node) => {
    if (node.classList.contains("shown")) {
      node.classList.remove("shown");
      node.classList.add("hidden");
    } else if (node.classList.contains("hidden")) {
      node.classList.remove("hidden");
      node.classList.add("shown");
    }
  }
  const resetPlayerCreation = () => {
    creationPlayerNames[0].value = "";
    creationPlayerNames[1].value = "";
    creationPlayerSigns[0].textContent = "X";
    creationPlayerSigns[1].textContent = "O";
    changeVSSelect.value = "pvp";
    creationPlayerNames[1].disabled = false;
  }
  const updatePlayerInfo = () => {
    for (let i = 0; i <= 1; i++) {
      playerInfoNames[i].textContent = players[i].getName();
      playerInfoSigns[i].textContent = players[i].getSign();
      playerInfoScores[i].textContent = players[i].getPoints();
    }
  }
  const showGameResult = (message) => {
    gameResultMessage.textContent = message;
    changeVisibility(gameResultContainer);
  }
  const updateCurrentPlayerSpan = () => {
    currentPlayerSpan.textContent = getCurrentPlayer().getName();
  }
  const changeGamemode = () => {
    gamemode.value = changeVSSelect.value;
  }
  const changePlayer2NameStatus = () => {
    if (gamemode.value === "pvp") {
      creationPlayerNames[1].value = "";
      creationPlayerNames[1].disabled = false;
    } else if (gamemode.value === "pvceasy" || gamemode.value === "pvcmedium" || gamemode.value === "pvchard") {
      creationPlayerNames[1].value = "Computer";
      creationPlayerNames[1].disabled = true;
    }
  }
  const bindControlerEvents = () => {
    newGameButton.addEventListener("click", () => {
      restart();
      resetPlayerCreation();
    });
    changeSignsButton.addEventListener("click", changeSigns);
    createPlayersButton.addEventListener("click", () => {
      if (creationPlayerNames[0].checkValidity() && creationPlayerNames[1].checkValidity()) {
        createPlayers();
        updatePlayerInfo();
        updateCurrentPlayerSpan();
        changeVisibility(creationContainer);
        resetPlayerCreation();
      }
    });
    gameResultButton.addEventListener("click", () => {
      changeVisibility(gameResultContainer);
    })
    changeVSSelect.addEventListener("change", () => {
      changeGamemode();
      changePlayer2NameStatus();
    });
  }
  const getCurrentPlayer = () => { return players[currentPlayer.number] };
  return { init, changeCurrentPlayer, getCurrentPlayer, updatePlayerInfo, showGameResult, gamemode };
})();

gameControler.init();