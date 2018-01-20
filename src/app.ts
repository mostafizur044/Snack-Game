import {Game} from './classes/game';


let game = new Game();
let startButton: any = document.getElementById('start-btn');
let stop: any = document.getElementById('stop');
let newGame: any = document.getElementById('new-game');
let option: any = document.querySelector('input[name="option"]:checked');

console.log(option);

startButton.addEventListener("click", function () {
    game.start();
});

stop.addEventListener("click", function () {  
    game.stop();
});

newGame.addEventListener("click", function () { 
    location.reload();
});





