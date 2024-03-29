(function(){
    'use strict';
    console.log('reading JS');

    const startGame = document.querySelector('#startgame');
    const gameControl = document.querySelector('#gamecontrol');
    const game = document.querySelector('#game');
    const score = document.querySelector('#score');
    const actionArea = document.querySelector('#actions');

    const pokerChips = new Audio('sounds/poker-chips.mp3');
    const rollingDice = new Audio('sounds/dice-roll.mp3');
    const winningCasino = new Audio('sounds/casino-win.wav');

    const gameData = {
        dice: ['images/1die.png', 'images/2die.png', 'images/3die.png', 'images/4die.png', 'images/5die.png', 'images/6die.png'],
        players: ['player 1', 'player 2'],
        score: [0, 0],
        roll1: 0,
        roll2: 0,
        rollSum: 0,
        index: 0,
        gameEnd: 29
    };

/*     //This gets the current player: 
    gameData.players[gameData.index]

    //This gets the first die and the second die: 
    gameData.dice[gameData.roll1-1]
    gameData.dice[gameData.roll2-1]

    //This gets the score of the current player: 
    gameData.score[gameData.index]

    //This gets the index, or turn
    gameData.index

    //This gets the individual dice values and the added dice value
    gameData.roll1
    gameData.roll2
    gameData.rollSum

    //This gets the winning threshold
    gameData.rollSum */

    startGame.addEventListener('click', function(){
        pokerChips.play();
        //randomly set game index here...
        gameData.index = Math.round(Math.random());
        console.log(gameData.index);

        gameControl.innerHTML = '<h2>The Game Has Started</h2>';
        gameControl.innerHTML+= '<button id="quit">Wanna Quit?</button>';

        document.getElementById('quit').addEventListener('click', function(){
            location.reload();
        });
        setUpTurn();
    });

    function setUpTurn() {
        game.innerHTML = `<p>Roll the dice for ${gameData.players[gameData.index]}</p>`;
        actionArea.innerHTML = '<button id="roll">Roll the Dice</button>';
        document.getElementById('roll').addEventListener('click', function(){
            throwDice();
            rollingDice.play();
        });
    }

    function throwDice() {
        actionArea.innerHTML = '';
        gameData.roll1 = Math.floor(Math.random() * 6) + 1; //using ceil could result in a zero!
        gameData.roll2 = Math.floor(Math.random() * 6) + 1;
        game.innerHTML = `<p>Roll the dice for ${gameData.players[gameData.index]}</p>`;
        game.innerHTML += `<img src="${gameData.dice[gameData.roll1-1]}">
            <img src="${gameData.dice[gameData.roll2-1]}">`;
        gameData.rollSum = gameData.roll1 + gameData.roll2;
        console.log(gameData);

        //if two 1's are rolled...
        if (gameData.rollSum === 2) {
            game.innerHTML += '<p>Ruh Roh! Snake eyes!</p>';
            //zero out score
            gameData.score[gameData.index] = 0;
            //switch player
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            //show the current score
            showCurrentScore();
            //set up turn
            setTimeout(setUpTurn, 2000);
        }
        //if either die is a 1...
        else if (gameData.roll1 === 1 || gameData.roll2 === 1) {
            game.innerHTML += `<p>Unlucky, one of your rolls was a one, switching to ${gameData.players[gameData.index]}</p>`;
            //switch player
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            //set up turn
            setTimeout(setUpTurn, 2000);
        }
        //if neither die is a 1...
        else {
            gameData.score[gameData.index] = gameData.score[gameData.index] + gameData.rollSum;
            actionArea.innerHTML = '<button id="rollagain">Roll again</button> or <button id="pass">Pass</button>';

            document.getElementById('rollagain').addEventListener('click', function() {
                setUpTurn();
                rollingDice.play();

            });
            document.getElementById('pass').addEventListener('click', function(){
                gameData.index ? (gameData.index = 0) : (gameData.index = 1);
                setUpTurn();
                rollingDice.play();

            });
            checkWinningCondition();
        }
    }

    //check winning condition
    function checkWinningCondition() {
        if(gameData.score[gameData.index] > gameData.gameEnd) {
            score.innerHTML = `<h2>${gameData.players[gameData.index]} wins with ${gameData.score[gameData.index]} points!</h2>`;
            winningCasino.play();

            actionArea.innerHTML = '';
            document.getElementById('quit').innerHTML = "Start a new game?";
        }
        else {
            showCurrentScore();
        }
    }

    function showCurrentScore() {
        score.innerHTML = `<p><strong>${gameData.players[0]} has 
        ${gameData.score[0]} points</strong> and <strong>${gameData.players[1]} has
        ${gameData.score[1]} points</strong></p>`;
    }
})();