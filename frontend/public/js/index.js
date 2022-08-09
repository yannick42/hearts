
import { Game } from "/js/game.js";
import { sleep } from "/js/util.js";

// distribute cards
Game.prepare();

let i = 1; // number of cards played

// Start game loop
while(true) {
  
  let playedCards = [null, null, null, null];

  // each player show a card
  for(let c = 0; c < Game.playingOrder.length; c++) {
    let card = Game.getCurrentPlayer().play('random') // TODO: add a basic "AI"
    playedCards[Game.getCurrentPlayerId()] = card;
    Game.next(); // go to next player
  }

  //console.log(playedCard);
  Game.showPlayedCard(playedCards);


  
  // TODO: check who wins !!


  // Update board

  Object.keys(Game.players).map(player => Game.displayPlayerCards(player));

  await sleep(100 /*ms*/);
  
  // TODO: 
  //Game.currentPlayer = playingOrder
  
  if(i >= 13) { // all cards played
    // TODO: Show winner, ...
    break;
  }

  i++;
}
