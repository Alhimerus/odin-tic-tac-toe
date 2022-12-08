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
  const bindBoardEvents = () => {
    for (let i = 0; i < boardSpots.length; i++) {
      boardSpots[i].addEventListener("click", () => {
        if (gameControler.getCurrentPlayer() !== undefined) {
          makeAMove(i);
        }
      })
    }
  }
  return { resetBoard, bindBoardEvents };
})();

const gameControler = (() => {
  const newGameButton = document.getElementById("newGame");
  const changeVSButton = document.getElementById("changeVS");
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
  const createPlayers = () => {
    players[0] = playerFactory(creationPlayerNames[0].value, creationPlayerSigns[0].textContent);
    players[1] = playerFactory(creationPlayerNames[1].value, creationPlayerSigns[1].textContent);
  }
  const init = () => {
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
    updateCurrentPlayerSpan();
  }
  const restart = () => {
    changeVisibility(creationContainer);
    gameBoard.resetBoard();
    currentPlayer.number = 0;
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
  const changeVSButtonContent = () => {
    if (changeVSButton.textContent === "Player vs Player") {
      changeVSButton.textContent = "Player vs AI (easy)";
    } else if (changeVSButton.textContent === "Player vs AI (easy)") {
      changeVSButton.textContent = "Player vs AI (hard)";
    } else {
      changeVSButton.textContent = "Player vs Player";
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
    changeVSButton.addEventListener("click", changeVSButtonContent);
  }
  const getCurrentPlayer = () => { return players[currentPlayer.number] };
  return { init, changeCurrentPlayer, getCurrentPlayer, updatePlayerInfo, showGameResult };
})();

gameControler.init();