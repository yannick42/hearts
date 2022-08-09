
import { Game } from "/js/game.js";
import { sleep } from "/js/util.js";

document.getElementById('start-btn').addEventListener('click', function() {
  main();
});

async function main() {

  // distribute cards
  Game.prepare();

  // Start game loop
  while(!Game.isFinished()) { // all cards played ?
    
    console.warn("----------------");

    let playedCards = [null, null, null, null];

    // each player show a card
    for(let c = 0; c < Game.playingOrder.length; c++) {
      let card = Game.getCurrentPlayer().play('random') // TODO: add a basic "AI"
      playedCards[Game.getCurrentPlayerId()] = card;
      Game.next(); // go to next player
    }

    // UI: show the 4 cards played
    Game.showPlayedCard(playedCards);
    //console.log(playedCards);
    

    // TODO: check who wins !!
    // ...
    
    // UI: update players board
    Object.keys(Game.players).map(player => Game.displayPlayerCards(player));


    // temporisation
    await sleep(100 /*ms*/);
  }

  // TODO: Show winner, ...
}

main()